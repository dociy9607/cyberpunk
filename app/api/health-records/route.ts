import { NextResponse } from "next/server";
import { serviceMode } from "@/lib/accounts";
import { deleteHealthRecord, listHealthRecords, upsertHealthRecord } from "@/lib/healthRecords";
import { readSession } from "@/lib/session";

async function requireUser() {
  const session = await readSession();
  if (!session) return { error: NextResponse.json({ error: "unauthorized", service: serviceMode() }, { status: 401 }) };
  return { session };
}

export async function GET() {
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const records = await listHealthRecords(auth.session.username);
  return NextResponse.json({ records, service: serviceMode() });
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const body = await request.json().catch(() => ({}));
  const record = await upsertHealthRecord(auth.session.username, body);
  return NextResponse.json({ record, service: serviceMode() }, { status: 201 });
}

export async function DELETE(request: Request) {
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || "";
  if (!id) return NextResponse.json({ error: "missing_id", service: serviceMode() }, { status: 400 });
  await deleteHealthRecord(auth.session.username, id);
  return NextResponse.json({ ok: true, service: serviceMode() });
}
