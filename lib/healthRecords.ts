import { getSupabaseAdmin } from "./supabaseAdmin";
import type { HealthRecord } from "./types";

let memoryHealthRecords: HealthRecord[] = [];

function fromDb(row: Record<string, unknown>): HealthRecord {
  return {
    id: String(row.id),
    ownerUsername: String(row.owner_username),
    type: row.type as HealthRecord["type"],
    date: String(row.record_date),
    time: String(row.record_time),
    mealSlot: (row.meal_slot || undefined) as HealthRecord["mealSlot"],
    amount: (row.amount || undefined) as string | undefined,
    food: (row.food || undefined) as string | undefined,
    poopType: (row.poop_type || undefined) as string | undefined,
    status: (row.status || undefined) as string | undefined,
    note: (row.note || undefined) as string | undefined,
    content: (row.content || undefined) as string | undefined,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function toDb(record: HealthRecord) {
  return {
    id: record.id,
    owner_username: record.ownerUsername,
    type: record.type,
    record_date: record.date,
    record_time: record.time,
    meal_slot: record.mealSlot || null,
    amount: record.amount || null,
    food: record.food || null,
    poop_type: record.poopType || null,
    status: record.status || null,
    note: record.note || null,
    content: record.content || null,
    created_at: record.createdAt,
    updated_at: record.updatedAt,
  };
}

export async function listHealthRecords(username: string) {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("health_records")
      .select("*")
      .eq("owner_username", username)
      .order("record_date", { ascending: false })
      .order("record_time", { ascending: false });
    if (error) throw error;
    return data.map(fromDb);
  }
  return memoryHealthRecords.filter((record) => record.ownerUsername === username);
}

export async function upsertHealthRecord(username: string, payload: Partial<HealthRecord>) {
  const now = new Date().toISOString();
  const record: HealthRecord = {
    id: payload.id || crypto.randomUUID(),
    ownerUsername: username,
    type: payload.type || "meal",
    date: payload.date || now.slice(0, 10),
    time: payload.time || "00:00",
    mealSlot: payload.mealSlot,
    amount: payload.amount,
    food: payload.food,
    poopType: payload.poopType,
    status: payload.status,
    note: payload.note,
    content: payload.content,
    createdAt: payload.createdAt || now,
    updatedAt: now,
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("health_records")
      .upsert(toDb(record), { onConflict: "id" })
      .select("*")
      .single();
    if (error) throw error;
    return fromDb(data);
  }

  memoryHealthRecords = memoryHealthRecords.filter((item) => !(item.ownerUsername === username && item.id === record.id));
  memoryHealthRecords.push(record);
  return record;
}

export async function deleteHealthRecord(username: string, id: string) {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("health_records").delete().eq("owner_username", username).eq("id", id);
    if (error) throw error;
    return;
  }
  memoryHealthRecords = memoryHealthRecords.filter((record) => !(record.ownerUsername === username && record.id === id));
}
