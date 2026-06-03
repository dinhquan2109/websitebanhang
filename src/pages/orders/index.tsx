import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import type { RootState } from "@/store";
import { formatVnd } from "@/utils/currency";

import Layout from "../../layouts/Main";

type OrderRow = {
  id: string;
  order_code: string;
  full_name: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items?: {
    product_name: string;
    quantity: number;
    price: number;
  }[];
};

const statusLabel: Record<string, string> = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

const OrdersPage = () => {
  const router = useRouter();
  const { session, user } = useSelector((state: RootState) => state.user);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const success = router.query.success === "1";
  const orderCode = typeof router.query.code === "string" ? router.query.code : "";

  useEffect(() => {
    if (!session?.access_token) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const res = await fetch("/api/orders", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const data = (await res.json()) as {
          orders?: OrderRow[];
          error?: string;
        };
        if (!res.ok) {
          setError(data.error || "Không tải được đơn hàng");
          return;
        }
        setOrders(data.orders ?? []);
      } catch {
        setError("Lỗi kết nối");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [session?.access_token]);

  return (
    <Layout>
      <section className="cart">
        <div className="container">
          <h3 className="cart__title">Đơn hàng của tôi</h3>

          {success && (
            <p style={{ color: "#27ae60", marginBottom: 16 }}>
              Đặt hàng thành công
              {orderCode ? ` — Mã đơn: ${orderCode}` : ""}
            </p>
          )}

          {!user && (
            <p>
              <Link href="/login?redirect=/orders">Đăng nhập</Link> để xem đơn hàng.
            </p>
          )}

          {error && <p style={{ color: "#c0392b" }}>{error}</p>}

          {loading && user && <p>Đang tải...</p>}

          {!loading && user && orders.length === 0 && !error && (
            <p>Chưa có đơn hàng.</p>
          )}

          <ul style={{ listStyle: "none", padding: 0 }}>
            {orders.map((order) => (
              <li
                key={order.id}
                style={{
                  border: "1px solid #eee",
                  padding: 16,
                  marginBottom: 12,
                  borderRadius: 8,
                }}
              >
                <strong>{order.order_code}</strong>
                <span style={{ float: "right" }}>
                  {statusLabel[order.status] || order.status}
                </span>
                <p>
                  {order.full_name} — {formatVnd(Number(order.total_amount))}
                </p>
                <small>{new Date(order.created_at).toLocaleString("vi-VN")}</small>
                {order.order_items?.length ? (
                  <ul>
                    {order.order_items.map((item, i) => (
                      <li key={i}>
                        {item.product_name} × {item.quantity} —{" "}
                        {formatVnd(item.price * item.quantity)}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>

          <Link href="/products" className="btn btn--rounded btn--border">
            Tiếp tục mua sắm
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default OrdersPage;
