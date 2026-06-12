import { NextResponse } from "next/server";
import { serviceMode } from "@/lib/accounts";
import { deleteHealthRecord, listHealthRecords, upsertHealthRecord } from "@/lib/healthRecords";
import { logApiError } from "@/lib/log";
import { readSession } from "@/lib/session";

async function requireUser() {
  const session = await readSession();
  if (!session) return { error: NextResponse.json({ error: "unauthorized", service: serviceMode() }, { status: 401 }) };
  return { session };
}

export async function GET() {
  try {
    const auth = await requireUser();
    if (auth.error) return auth.error;
    const records = await listHealthRecords(auth.session.username);
    return NextResponse.json({ records, service: serviceMode() });
  } catch (error) {
    logApiError("api.health-records.list", error);
    return NextResponse.json({ error: "health_records_list_failed", service: serviceMode() }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireUser();
    if (auth.error) return auth.error;
    const body = await request.json().catch(() => ({}));
    const record = await upsertHealthRecord(auth.session.username, body);
    return NextResponse.json({ record, service: serviceMode() }, { status: 201 });
  } catch (error) {
    logApiError("api.health-records.save", error);
    return NextResponse.json({ error: "health_records_save_failed", service: serviceMode() }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireUser();
    if (auth.error) return auth.error;
    const url = new URL(request.url);
    const id = url.searchParams.get("id") || "";
    if (!id) return NextResponse.json({ error: "missing_id", service: serviceMode() }, { status: 400 });
    await deleteHealthRecord(auth.session.username, id);
    return NextResponse.json({ ok: true, service: serviceMode() });
  } catch (error) {
    logApiError("api.health-records.delete", error);
    return NextResponse.json({ error: "health_records_delete_failed", service: serviceMode() }, { status: 500 });
  }
}
