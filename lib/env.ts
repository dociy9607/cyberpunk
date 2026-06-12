export const SESSION_DAYS = 30;
export const COOKIE_NAME = "dehviz_session";
export const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "QDS-Admin-2026!";
export const SESSION_SECRET = process.env.AUTH_JWT_SECRET || DEFAULT_ADMIN_PASSWORD;

export function supabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
}

export function supabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

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

function firstEnv(keys: string[]) {
  return keys.map((key) => process.env[key]).find(Boolean) || "";
}

export function kvUrl() {
  return firstEnv(KV_URL_ENV_KEYS);
}

export function kvToken() {
  return firstEnv(KV_TOKEN_ENV_KEYS);
}

export function supabaseConfigured() {
  return Boolean(supabaseUrl() && supabaseServiceRoleKey());
}

export function kvConfigured() {
  return Boolean(kvUrl() && kvToken());
}

export const acceptedEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  ...KV_URL_ENV_KEYS,
  ...KV_TOKEN_ENV_KEYS,
];
