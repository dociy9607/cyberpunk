export type UserRole = "admin" | "user";

export type SafeAccount = {
  username: string;
  role: UserRole;
  createdAt: string;
};

export type AccountRow = {
  username: string;
  role: UserRole;
  passwordHash: string;
  createdAt: string;
};

export type HealthRecordType = "meal" | "poop" | "vomit" | "sleep";

export type HealthRecord = {
  id: string;
  ownerUsername: string;
  type: HealthRecordType;
  date: string;
  time: string;
  mealSlot?: "breakfast" | "lunch" | "dinner" | "night";
  amount?: string;
  food?: string;
  poopType?: string;
  status?: string;
  note?: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
};

export type SessionUser = {
  username: string;
  role: UserRole;
  exp: number;
};

export type ServiceMode = {
  accountStore: "supabase-postgres" | "upstash-redis" | "server-memory-fallback";
  healthRecordStore: "supabase-postgres" | "server-memory-fallback";
  persistentAccounts: boolean;
  persistentHealthRecords: boolean;
  supabaseConfigured: boolean;
};
