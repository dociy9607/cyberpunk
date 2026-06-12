import crypto from "crypto";
import { cookies } from "next/headers";
import { COOKIE_NAME, SESSION_DAYS, SESSION_SECRET } from "./env";
import type { AccountRow, SessionUser } from "./types";

function sign(value: string) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("base64url");
}

export function createSession(account: AccountRow) {
  const payload: SessionUser = {
    username: account.username,
    role: account.role,
    exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export async function readSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature || sign(encoded) !== signature) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionUser;
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  (await cookies()).set(COOKIE_NAME, token, {
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
}

export async function clearSessionCookie() {
  (await cookies()).set(COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
}
