import { NextResponse } from "next/server";
import { serviceMode } from "@/lib/accounts";
import { readSession } from "@/lib/session";

export async function GET() {
  const session = await readSession();
  if (!session) return NextResponse.json({ authenticated: false, service: serviceMode() }, { status: 401 });
  return NextResponse.json({
    authenticated: true,
    user: {
      username: session.username,
      role: session.role,
    },
    service: serviceMode(),
  });
}
