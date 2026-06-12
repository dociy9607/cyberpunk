import { createClient } from "@supabase/supabase-js";
import { supabaseConfigured, supabaseServiceRoleKey, supabaseUrl } from "./env";

export function getSupabaseAdmin() {
  if (!supabaseConfigured()) return null;
  return createClient(supabaseUrl(), supabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
