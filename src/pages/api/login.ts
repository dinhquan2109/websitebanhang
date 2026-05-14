import type { NextApiRequest, NextApiResponse } from "next";

import { getSupabaseServerClient } from "@/lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ status: false, error: "Method not allowed" });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return res.status(503).json({
      status: false,
      error:
        "Chưa cấu hình Supabase. Trên Vercel thêm SUPABASE_URL + SUPABASE_ANON_KEY (hoặc NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY), rồi redeploy.",
    });
  }

  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({
      status: false,
      error: "Vui lòng nhập email và mật khẩu.",
    });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ status: false, error: error.message });
  }

  return res.status(200).json({
    status: true,
    session: data.session,
    user: data.user,
  });
}
