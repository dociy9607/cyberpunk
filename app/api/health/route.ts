import { NextResponse } from "next/server";
import { acceptedEnv } from "@/lib/env";
import { serviceMode } from "@/lib/accounts";

export async function GET() {
  const service = serviceMode();
  return NextResponse.json({
    ok: true,
    auth: service,
    requirements: {
      loginApi: true,
      sessionCookieDays: 30,
      accountAdminApi: true,
      cloudHealthRecords: service.persistentHealthRecords,
      persistentAccountStore: service.persistentAccounts,
      acceptedEnv,
    },
  });
}
