const crypto = require("crypto");

const COOKIE_NAME = "dehviz_session";
const SESSION_DAYS = 30;
const ACCOUNTS_KEY = "dehviz:auth:accounts:v1";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "QDS-Admin-2026!";
const SESSION_SECRET = process.env.AUTH_JWT_SECRET || DEFAULT_ADMIN_PASSWORD;

let memoryAccounts = null;

const KV_URL_ENV_KEYS = [
  "KV_REST_API_URL",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_KV_REST_API_URL",
];

const KV_TOKEN_ENV_KEYS = [
  "KV_REST_API_TOKEN",
  "UPSTASH_REDIS_REST_TOKEN",
  "UPSTASH_REDIS_REST_KV_REST_API_TOKEN",
];

function firstEnv(keys) {
  return keys.map((key) => process.env[key]).find(Boolean) || "";
}

function kvUrl() {
  return firstEnv(KV_URL_ENV_KEYS);
}

function kvToken() {
  return firstEnv(KV_TOKEN_ENV_KEYS);
}

function json(res, status, payload, extraHeaders = {}) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...extraHeaders,
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1024 * 1024) {
        reject(new Error("Body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function kvConfigured() {
  return Boolean(kvUrl() && kvToken());
}

async function kvRequest(path, init = {}) {
  const response = await fetch(`${kvUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${kvToken()}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  if (!response.ok) {
    throw new Error(`KV request failed: ${response.status}`);
  }
  return response.json();
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(String(password), salt, 120000, 32, "sha256").toString("hex");
  return `pbkdf2$${salt}$${hash}`;
}

function verifyPassword(password, stored) {
  const [, salt, hash] = String(stored || "").split("$");
  if (!salt || !hash) return false;
  const candidate = hashPassword(password, salt).split("$")[2];
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(candidate, "hex"));
}

function safeAccount(account) {
  return {
    username: account.username,
    role: account.role,
    createdAt: account.createdAt,
  };
}

function defaultAccounts() {
  return [{
    username: "admin",
    role: "admin",
    passwordHash: hashPassword(DEFAULT_ADMIN_PASSWORD, "dehviz-default-admin"),
    createdAt: new Date("2026-06-11T00:00:00.000Z").toISOString(),
  }];
}

async function getAccounts() {
  if (kvConfigured()) {
    const result = await kvRequest(`/get/${encodeURIComponent(ACCOUNTS_KEY)}`);
    if (Array.isArray(result.result)) return result.result;
    if (typeof result.result === "string") {
      try {
        const parsed = JSON.parse(result.result);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    const accounts = defaultAccounts();
    await saveAccounts(accounts);
    return accounts;
  }

  if (!memoryAccounts) memoryAccounts = defaultAccounts();
  return memoryAccounts;
}

async function saveAccounts(accounts) {
  if (kvConfigured()) {
    await kvRequest(`/set/${encodeURIComponent(ACCOUNTS_KEY)}/${encodeURIComponent(JSON.stringify(accounts))}`, { method: "POST" });
    return;
  }
  memoryAccounts = accounts;
}

function sign(value) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("base64url");
}

function createSession(account) {
  const payload = {
    username: account.username,
    role: account.role,
    exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  return Object.fromEntries(header.split(";").map((part) => {
    const index = part.indexOf("=");
    if (index === -1) return ["", ""];
    return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())];
  }).filter(([key]) => key));
}

function readSession(req) {
  const token = parseCookies(req)[COOKIE_NAME];
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature || sign(encoded) !== signature) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function sessionCookie(token) {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${SESSION_DAYS * 24 * 60 * 60}; HttpOnly; Secure; SameSite=Lax`;
}

function clearCookie() {
  return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}

function serviceMode() {
  return {
    persistent: kvConfigured(),
    store: kvConfigured() ? "upstash-rest" : "server-memory-fallback",
    acceptedEnv: [...KV_URL_ENV_KEYS, ...KV_TOKEN_ENV_KEYS],
  };
}

module.exports = {
  COOKIE_NAME,
  clearCookie,
  createSession,
  getAccounts,
  hashPassword,
  json,
  readBody,
  readSession,
  safeAccount,
  saveAccounts,
  serviceMode,
  sessionCookie,
  verifyPassword,
};
