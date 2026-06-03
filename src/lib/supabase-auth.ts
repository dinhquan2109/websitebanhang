import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseServerClient } from "./supabase";

function getUrlAndKey(): { url: string; anonKey: string } | null {
  const client = getSupabaseServerClient();
  if (!client) {
    return null;
  }
  const rawUrl =
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey =
    process.env.SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!rawUrl || !anonKey) {
    return null;
  }
  return { url: rawUrl.replace(/\/+$/, "").replace(/\/rest\/v1\/?$/i, ""), anonKey };
}

/** Client Supabase với JWT người dùng (RLS áp dụng đúng user). */
export function getSupabaseAsUser(accessToken: string): SupabaseClient | null {
  const creds = getUrlAndKey();
  if (!creds) {
    return null;
  }
  return createClient(creds.url, creds.anonKey, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
}

export function getBearerToken(req: {
  headers: { authorization?: string };
}): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return null;
  }
  return header.slice(7).trim();
}
