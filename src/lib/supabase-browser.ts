import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function normalizeSupabaseUrl(url: string): string {
  let u = url.trim().replace(/\/+$/, "");
  u = u.replace(/\/rest\/v1\/?$/i, "");
  return u;
}

let browserClient: SupabaseClient | null = null;

/** Client Supabase trên trình duyệt — dùng NEXT_PUBLIC_* (đúng với env Vercel của bạn). */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!rawUrl || !anonKey) {
    return null;
  }

  const url = normalizeSupabaseUrl(rawUrl);
  if (!/^https?:\/\//i.test(url)) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return browserClient;
}
