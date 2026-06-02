import type { AuthSession, AuthUser } from "@/store/reducers/user";

type SupabaseUserPayload = {
  id: string;
  email?: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
  };
};

type SupabaseSessionPayload = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
};

export function mapSupabaseUser(user: SupabaseUserPayload): AuthUser {
  const meta = user.user_metadata ?? {};
  const fullName = [meta.first_name, meta.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    id: user.id,
    email: user.email,
    name: fullName || user.email || "Khách hàng",
  };
}

export function mapSupabaseSession(
  session: SupabaseSessionPayload | null | undefined,
): AuthSession | null {
  if (!session?.access_token || !session?.refresh_token) {
    return null;
  }

  return {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
  };
}
