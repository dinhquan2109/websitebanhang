import type { NextApiRequest, NextApiResponse } from "next";

import { getSupabaseServerClient } from "@/lib/supabase";

/**
 * Kiểm tra nhanh (không lộ giá trị biến): Supabase đã nhận env trên Vercel chưa.
 * GET /api/health-env
 */
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const client = getSupabaseServerClient();
  res.status(200).json({
    supabaseClientOk: client !== null,
    hint: client
      ? "Env Supabase đã đủ; nếu đăng nhập vẫn lỗi kiểm tra Auth / email trong Supabase."
      : "Thiếu hoặc sai URL/key. Xem SUPABASE_URL / SUPABASE_ANON_KEY (hoặc NEXT_PUBLIC_*) trên Vercel, không dùng /rest/v1 trong URL.",
  });
}
