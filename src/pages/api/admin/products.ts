import type { NextApiRequest, NextApiResponse } from "next";

import { getBearerToken, getSupabaseAsUser } from "@/lib/supabase-auth";

type AdminAuthResult =
  | { client: NonNullable<ReturnType<typeof getSupabaseAsUser>> }
  | { error: string; status: number };

async function requireAdmin(token: string): Promise<AdminAuthResult> {
  const client = getSupabaseAsUser(token);
  if (!client) {
    return { error: "Supabase chưa cấu hình", status: 503 };
  }

  const {
    data: { user },
  } = await client.auth.getUser(token);

  if (!user) {
    return { error: "Unauthorized", status: 401 };
  }

  const { data: profile } = await client
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return { error: "Chỉ admin mới được truy cập", status: 403 };
  }

  return { client };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const auth = await requireAdmin(token);
  if ("error" in auth) {
    return res.status(auth.status).json({ error: auth.error });
  }

  const { client } = auth;

  if (req.method === "GET") {
    const { data, error } = await client
      .from("products")
      .select(`*, categories ( name )`)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ products: data ?? [] });
  }

  if (req.method === "POST") {
    const body = req.body as Record<string, unknown>;
    const { data, error } = await client
      .from("products")
      .insert(body)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ product: data });
  }

  if (req.method === "PATCH") {
    const { id, ...updates } = req.body as { id?: string };
    if (!id) {
      return res.status(400).json({ error: "Thiếu id sản phẩm" });
    }

    const { data, error } = await client
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ product: data });
  }

  if (req.method === "DELETE") {
    const { id } = req.body as { id?: string };
    if (!id) {
      return res.status(400).json({ error: "Thiếu id" });
    }

    const { error } = await client.from("products").delete().eq("id", id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
