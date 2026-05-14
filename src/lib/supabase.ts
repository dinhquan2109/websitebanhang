import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function firstNonEmpty(...values: (string | undefined)[]): string | undefined {
  for (const v of values) {
    const t = v?.trim();
    if (t) {
      return t;
    }
  }
  return undefined;
}

/** Bỏ slash cuối và đoạn /rest/v1 nếu dán nhầm từ Dashboard */
function normalizeSupabaseUrl(url: string): string {
  let u = url.trim().replace(/\/+$/, "");
  u = u.replace(/\/rest\/v1\/?$/i, "");
  return u;
}

/**
 * Client Supabase cho API Routes (server).
 * Hỗ trợ cả tên biến server-only (Vercel) và NEXT_PUBLIC_* (local / docs cũ).
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  const rawUrl = firstNonEmpty(
    process.env.SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
  const anonKey = firstNonEmpty(
    process.env.SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  if (!rawUrl || !anonKey) {
    return null;
  }

  const url = normalizeSupabaseUrl(rawUrl);
  if (!/^https?:\/\//i.test(url)) {
    return null;
  }

  return createClient(url, anonKey);
}
