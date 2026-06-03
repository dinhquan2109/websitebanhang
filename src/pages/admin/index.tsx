import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import type { RootState } from "@/store";

import Layout from "../../layouts/Main";

const AdminHome = () => {
  const router = useRouter();
  const { session } = useSelector((state: RootState) => state.user);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.access_token) {
      setLoading(false);
      return;
    }

    const load = async () => {
      const res = await fetch("/api/me", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = (await res.json()) as { profile?: { role?: string } };
      setRole(data.profile?.role ?? "user");
      setLoading(false);
    };

    void load();
  }, [session?.access_token]);

  if (!session?.access_token) {
    return (
      <Layout>
        <div className="container" style={{ padding: "48px 0" }}>
          <p>
            <Link href="/login?redirect=/admin">Đăng nhập</Link> để vào quản trị.
          </p>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="container" style={{ padding: "48px 0" }}>
          <p>Đang kiểm tra quyền...</p>
        </div>
      </Layout>
    );
  }

  if (role !== "admin") {
    return (
      <Layout>
        <div className="container" style={{ padding: "48px 0" }}>
          <p>Tài khoản chưa có quyền admin.</p>
          <p>
            Trong Supabase SQL Editor chạy:{" "}
            <code>
              update profiles set role = &apos;admin&apos; where email =
              &apos;email-cua-ban&apos;;
            </code>
          </p>
          <button
            type="button"
            className="btn btn--rounded btn--border"
            onClick={() => void router.push("/")}
          >
            Về trang chủ
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container" style={{ padding: "48px 0" }}>
        <h2>Quản trị Shop Dinhquan</h2>
        <ul style={{ marginTop: 24, lineHeight: 2 }}>
          <li>
            <Link href="/admin/products">Quản lý sản phẩm</Link>
          </li>
          <li>
            <Link href="/admin/orders">Quản lý đơn hàng</Link>
          </li>
        </ul>
        <p style={{ marginTop: 24, color: "#666" }}>
          Lần đầu: chạy <code>supabase/schema.sql</code>, sau đó{" "}
          <code>POST /api/seed</code> (cần SUPABASE_SERVICE_ROLE_KEY).
        </p>
      </div>
    </Layout>
  );
};

export default AdminHome;
