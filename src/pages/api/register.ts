import type { NextApiRequest, NextApiResponse } from "next";

import { getSupabaseServerClient } from "@/lib/supabase";

type RegisterBody = {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
};

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
        "Chưa cấu hình Supabase. Thêm SUPABASE_URL + SUPABASE_ANON_KEY (hoặc bộ NEXT_PUBLIC_*) rồi redeploy.",
    });
  }

  const { email, password, firstName, lastName } = req.body as RegisterBody;
  if (!email || !password) {
    return res.status(400).json({
      status: false,
      error: "Email và mật khẩu là bắt buộc.",
    });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName ?? "",
        last_name: lastName ?? "",
      },
    },
  });

  if (error) {
    return res.status(400).json({ status: false, error: error.message });
  }

  return res.status(200).json({
    status: true,
    user: data.user,
    session: data.session,
    needsEmailConfirmation: !data.session,
  });
}
