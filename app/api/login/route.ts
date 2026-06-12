import { NextResponse } from "next/server";
import { getAccounts, safeAccount, serviceMode } from "@/lib/accounts";
import { logApiError } from "@/lib/log";
import { verifyPassword } from "@/lib/password";
import { createSession, setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const username = String(body.username || "").trim();
    const password = String(body.password || "");
    const accounts = await getAccounts();
    const account = accounts.find((item) => item.username === username);
    if (!account || !verifyPassword(password, account.passwordHash)) {
      return NextResponse.json({ error: "invalid_credentials", service: serviceMode() }, { status: 401 });
    }
    await setSessionCookie(createSession(account));
    return NextResponse.json({ user: safeAccount(account), service: serviceMode() });
  } catch (error) {
    logApiError("api.login", error);
    return NextResponse.json({ error: "login_failed", detail: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
