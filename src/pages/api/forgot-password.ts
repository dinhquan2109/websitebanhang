import type { NextApiRequest, NextApiResponse } from "next";

import { getSupabaseServerClient } from "@/lib/supabase";

function getSiteOrigin(req: NextApiRequest): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) {
    return fromEnv;
  }
  const host = req.headers.host;
  if (!host) {
    return "";
  }
  const proto =
    (req.headers["x-forwarded-proto"] as string) ||
    (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

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

  const { email } = (req.body ?? {}) as { email?: string };
  if (!email) {
    return res.status(400).json({
      status: false,
      error: "Vui lòng nhập email.",
    });
  }

  const origin = getSiteOrigin(req);
  const redirectTo = origin ? `${origin}/login` : undefined;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return res.status(400).json({ status: false, error: error.message });
  }

  return res.status(200).json({
    status: true,
    message:
      "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được liên kết đặt lại mật khẩu.",
  });
}
