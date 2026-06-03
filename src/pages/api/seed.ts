import type { NextApiRequest, NextApiResponse } from "next";

import { buildSeedProducts, SEED_CATEGORY } from "@/lib/seed-data";
import { getSupabaseServiceClient } from "@/lib/supabase-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.SEED_SECRET?.trim();
  if (secret) {
    const provided =
      (req.headers["x-seed-secret"] as string) ||
      (req.body as { secret?: string })?.secret;
    if (provided !== secret) {
      return res.status(401).json({ error: "Sai mã SEED_SECRET" });
    }
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return res.status(503).json({
      error:
        "Thiếu SUPABASE_SERVICE_ROLE_KEY trên server. Chạy supabase/schema.sql và supabase/seed.sql trong SQL Editor.",
    });
  }

  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  if (count && count > 0) {
    return res.status(200).json({
      message: "Đã có sản phẩm trong DB",
      productCount: count,
    });
  }

  let categoryId: string;

  const { data: existingCat } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", SEED_CATEGORY.slug)
    .maybeSingle();

  if (existingCat?.id) {
    categoryId = existingCat.id;
  } else {
    const { data: cat, error: catErr } = await supabase
      .from("categories")
      .insert(SEED_CATEGORY)
      .select("id")
      .single();

    if (catErr || !cat) {
      return res.status(500).json({
        error: catErr?.message || "Không tạo được danh mục",
      });
    }
    categoryId = cat.id;
  }

  const rows = buildSeedProducts(categoryId);
  const { error: prodErr } = await supabase.from("products").insert(rows);

  if (prodErr) {
    return res.status(500).json({ error: prodErr.message });
  }

  return res.status(201).json({
    message: "Seed thành công",
    productCount: rows.length,
    categoryId,
  });
}
