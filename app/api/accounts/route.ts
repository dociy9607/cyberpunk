import { NextResponse } from "next/server";
import { createAccount, deleteAccount, getAccounts, safeAccount, serviceMode } from "@/lib/accounts";
import { logApiError } from "@/lib/log";
import { readSession } from "@/lib/session";
import type { UserRole } from "@/lib/types";

async function requireAdmin() {
  const session = await readSession();
  if (!session) return { error: NextResponse.json({ error: "unauthorized", service: serviceMode() }, { status: 401 }) };
  if (session.role !== "admin") return { error: NextResponse.json({ error: "forbidden", service: serviceMode() }, { status: 403 }) };
  return { session };
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const accounts = await getAccounts();
  return NextResponse.json({ accounts: accounts.map(safeAccount), service: serviceMode() });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  try {
    const body = await request.json().catch(() => ({}));
    const role: UserRole = body.role === "admin" ? "admin" : "user";
    const account = await createAccount(String(body.username || ""), String(body.password || ""), role);
    return NextResponse.json({ account: safeAccount(account), service: serviceMode() }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const status = message === "account_exists" ? 409 : message === "weak_password" || message === "invalid_username" ? 400 : 500;
    if (status === 500) logApiError("api.accounts.create", error);
    return NextResponse.json({ error: message, service: serviceMode() }, { status });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const url = new URL(request.url);
  const username = url.searchParams.get("username") || "";
  if (username === auth.session?.username) {
    return NextResponse.json({ error: "cannot_delete_self", service: serviceMode() }, { status: 400 });
  }
  try {
    await deleteAccount(username);
    return NextResponse.json({ ok: true, service: serviceMode() });
  } catch (error) {
    logApiError("api.accounts.delete", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error), service: serviceMode() }, { status: 400 });
  }
}
