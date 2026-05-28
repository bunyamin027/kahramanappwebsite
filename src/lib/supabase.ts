import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// ── Supabase Client (Server-side / API routes) ─────────────
// Uses anon key for public read operations.
// For write operations, use service_role key in admin routes.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Creates a Supabase client for server-side usage.
 * Falls back gracefully if env vars are not set (returns null).
 */
export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
}

/**
 * Creates a Supabase admin client with service_role key.
 * Only use in secure server-side contexts (API routes).
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }
  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
