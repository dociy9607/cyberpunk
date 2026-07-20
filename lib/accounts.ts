import { DEFAULT_ADMIN_PASSWORD, kvConfigured, supabaseConfigured } from "./env";
import { kvRequest } from "./kv";
import { hashPassword } from "./password";
import { getSupabaseAdmin } from "./supabaseAdmin";
import type { AccountRow, SafeAccount, ServiceMode, UserRole } from "./types";

const ACCOUNTS_KEY = "dehviz:auth:accounts:v1";
const ACCOUNT_STORE_TIMEOUT_MS = 5000;
let memoryAccounts: AccountRow[] | null = null;

async function withTimeout<T>(operation: PromiseLike<T>, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label}_timeout`)), ACCOUNT_STORE_TIMEOUT_MS);
  });

  try {
    return await Promise.race([operation, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function defaultAccounts(): AccountRow[] {
  return [{
    username: "admin",
    role: "admin",
    passwordHash: hashPassword(DEFAULT_ADMIN_PASSWORD, "dehviz-default-admin"),
    createdAt: new Date("2026-06-11T00:00:00.000Z").toISOString(),
  }];
}

function fromDb(row: Record<string, unknown>): AccountRow {
  return {
    username: String(row.username),
    role: row.role === "admin" ? "admin" : "user",
    passwordHash: String(row.password_hash),
    createdAt: String(row.created_at),
  };
}

function toDb(account: AccountRow) {
  return {
    username: account.username,
    role: account.role,
    password_hash: account.passwordHash,
    created_at: account.createdAt,
  };
}

export function safeAccount(account: AccountRow): SafeAccount {
  return {
    username: account.username,
    role: account.role,
    createdAt: account.createdAt,
  };
}

async function readUpstashAccounts() {
  type KVGet = { result?: unknown };
  const result = await kvRequest<KVGet>(`/get/${encodeURIComponent(ACCOUNTS_KEY)}`);
  if (Array.isArray(result.result)) return result.result as AccountRow[];
  if (typeof result.result === "string") {
    try {
      const parsed = JSON.parse(result.result) as AccountRow[];
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  return null;
}

async function writeUpstashAccounts(accounts: AccountRow[]) {
  await kvRequest(`/set/${encodeURIComponent(ACCOUNTS_KEY)}/${encodeURIComponent(JSON.stringify(accounts))}`, { method: "POST" });
}

function logStoreFallback(context: string, error: unknown) {
  const details = error && typeof error === "object"
    ? error as Record<string, unknown>
    : { message: String(error) };
  console.warn(JSON.stringify({
    level: "warn",
    context,
    message: String(details.message || "account_store_unavailable"),
    code: details.code,
    hint: details.hint,
  }));
}

async function readFallbackAccounts(): Promise<AccountRow[]> {
  if (kvConfigured()) {
    try {
      const accounts = await readUpstashAccounts();
      if (accounts) return accounts;
      const defaults = defaultAccounts();
      await writeUpstashAccounts(defaults);
      return defaults;
    } catch (error) {
      logStoreFallback("accounts.upstash.read", error);
    }
  }

  if (!memoryAccounts) memoryAccounts = defaultAccounts();
  return memoryAccounts;
}

async function writeFallbackAccounts(accounts: AccountRow[]) {
  if (kvConfigured()) {
    try {
      await writeUpstashAccounts(accounts);
      return;
    } catch (error) {
      logStoreFallback("accounts.upstash.write", error);
    }
  }
  memoryAccounts = accounts;
}

export async function getAccounts(): Promise<AccountRow[]> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await withTimeout(
        supabase.from("admin_accounts").select("*").order("created_at", { ascending: true }),
        "accounts_read",
      );
      if (error) throw error;
      if (data?.length) return data.map(fromDb);
      const accounts = defaultAccounts();
      const { error: insertError } = await withTimeout(
        supabase.from("admin_accounts").insert(accounts.map(toDb)),
        "accounts_seed",
      );
      if (insertError) throw insertError;
      return accounts;
    } catch (error) {
      logStoreFallback("accounts.supabase.read", error);
    }
  }

  return readFallbackAccounts();
}

export async function createAccount(username: string, password: string, role: UserRole) {
  const cleanUsername = username.trim();
  if (!cleanUsername || cleanUsername.length < 3) throw new Error("invalid_username");
  if (!password || password.length < 8) throw new Error("weak_password");

  const accounts = await getAccounts();
  if (accounts.some((account) => account.username.toLowerCase() === cleanUsername.toLowerCase())) {
    throw new Error("account_exists");
  }

  const account: AccountRow = {
    username: cleanUsername,
    role,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { error } = await withTimeout(
        supabase.from("admin_accounts").insert(toDb(account)),
        "accounts_create",
      );
      if (error) throw error;
      return account;
    } catch (error) {
      logStoreFallback("accounts.supabase.create", error);
    }
  }

  const nextAccounts = [...accounts, account];
  await writeFallbackAccounts(nextAccounts);
  return account;
}

export async function deleteAccount(username: string) {
  if (!username || username === "admin") throw new Error("protected_account");

  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { error } = await withTimeout(
        supabase.from("admin_accounts").delete().eq("username", username),
        "accounts_delete",
      );
      if (error) throw error;
      return;
    } catch (error) {
      logStoreFallback("accounts.supabase.delete", error);
    }
  }

  const accounts = await getAccounts();
  const nextAccounts = accounts.filter((account) => account.username !== username);
  await writeFallbackAccounts(nextAccounts);
}

export function serviceMode(): ServiceMode {
  return {
    accountStore: supabaseConfigured() ? "supabase-postgres" : kvConfigured() ? "upstash-redis" : "server-memory-fallback",
    healthRecordStore: supabaseConfigured() ? "supabase-postgres" : "server-memory-fallback",
    persistentAccounts: supabaseConfigured() || kvConfigured(),
    persistentHealthRecords: supabaseConfigured(),
    supabaseConfigured: supabaseConfigured(),
  };
}
