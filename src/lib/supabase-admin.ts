import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseServerClient } from "./supabase";

function normalizeSupabaseUrl(url: string): string {
  let u = url.trim().replace(/\/+$/, "");
  u = u.replace(/\/rest\/v1\/?$/i, "");
  return u;
}

/** Service role — chỉ dùng trên server (seed, bypass RLS). */
export function getSupabaseServiceClient(): SupabaseClient | null {
  const rawUrl =
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!rawUrl || !serviceKey) {
    return null;
  }

  const url = normalizeSupabaseUrl(rawUrl);
  if (!/^https?:\/\//i.test(url)) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function hasDatabaseConfigured(): boolean {
  return getSupabaseServerClient() !== null;
}
