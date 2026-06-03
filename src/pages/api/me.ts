import type { NextApiRequest, NextApiResponse } from "next";

import { getBearerToken, getSupabaseAsUser } from "@/lib/supabase-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const client = getSupabaseAsUser(token);
  if (!client) {
    return res.status(503).json({ error: "Supabase chưa cấu hình" });
  }

  const {
    data: { user },
    error: userErr,
  } = await client.auth.getUser(token);

  if (userErr || !user) {
    return res.status(401).json({ error: "Invalid session" });
  }

  const { data: profile, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
    },
    profile: profile ?? {
      id: user.id,
      email: user.email,
      role: "user",
    },
  });
}
