import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import type { RootState } from "@/store";
import { formatVnd } from "@/utils/currency";

import Layout from "../../layouts/Main";

type AdminOrder = {
  id: string;
  order_code: string;
  full_name: string;
  phone: string;
  total_amount: number;
  status: string;
  created_at: string;
};

const statuses = ["pending", "confirmed", "shipping", "completed", "cancelled"];

const AdminOrders = () => {
  const { session } = useSelector((state: RootState) => state.user);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState("");

  const headers = session?.access_token
    ? {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      }
    : null;

  const load = async () => {
    if (!headers) return;
    const res = await fetch("/api/admin/orders", { headers });
    const data = (await res.json()) as { orders?: AdminOrder[]; error?: string };
    if (!res.ok) {
      setError(data.error || "Lỗi");
      return;
    }
    setOrders(data.orders ?? []);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.access_token]);

  const updateStatus = async (orderId: string, status: string) => {
    if (!headers) return;
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers,
      body: JSON.stringify({ orderId, status }),
    });
    if (res.ok) {
      void load();
    }
  };

  return (
    <Layout>
      <div className="container" style={{ padding: "48px 0" }}>
        <Link href="/admin">← Quản trị</Link>
        <h2 style={{ marginTop: 16 }}>Đơn hàng</h2>
        {error && <p style={{ color: "#c0392b" }}>{error}</p>}

        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
          <thead>
            <tr>
              <th align="left">Mã</th>
              <th align="left">Khách</th>
              <th align="right">Tổng</th>
              <th align="left">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderTop: "1px solid #eee" }}>
                <td>{o.order_code}</td>
                <td>
                  {o.full_name}
                  <br />
                  <small>{o.phone}</small>
                </td>
                <td align="right">{formatVnd(Number(o.total_amount))}</td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) => void updateStatus(o.id, e.target.value)}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default AdminOrders;
