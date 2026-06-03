import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import type { RootState } from "@/store";
import { formatVnd } from "@/utils/currency";

import Layout from "../../layouts/Main";

type AdminProduct = {
  id: string;
  legacy_id: string | null;
  name: string;
  current_price: number;
  quantity: number;
};

const AdminProducts = () => {
  const { session } = useSelector((state: RootState) => state.user);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const headers = session?.access_token
    ? { Authorization: `Bearer ${session.access_token}` }
    : undefined;

  const load = async () => {
    if (!headers) return;
    const res = await fetch("/api/admin/products", { headers });
    const data = (await res.json()) as {
      products?: AdminProduct[];
      error?: string;
    };
    if (!res.ok) {
      setError(data.error || "Lỗi");
      return;
    }
    setProducts(data.products ?? []);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.access_token]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headers || !name || !price) return;

    const slug = `sp-${Date.now()}`;
    const p = Number(price);

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug,
        description: name,
        price: p,
        current_price: p,
        discount: 0,
        quantity: 10,
        colors: ["#000"],
        sizes: ["l"],
        images: ["/images/products/product-1.jpg"],
        rating: 4.5,
      }),
    });

    if (res.ok) {
      setName("");
      setPrice("");
      void load();
    } else {
      const data = (await res.json()) as { error?: string };
      setError(data.error || "Thêm thất bại");
    }
  };

  return (
    <Layout>
      <div className="container" style={{ padding: "48px 0" }}>
        <Link href="/admin">← Quản trị</Link>
        <h2 style={{ marginTop: 16 }}>Sản phẩm</h2>
        {error && <p style={{ color: "#c0392b" }}>{error}</p>}

        <form onSubmit={handleAdd} style={{ margin: "24px 0", display: "flex", gap: 8 }}>
          <input
            className="form__input form__input--sm"
            placeholder="Tên SP mới"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="form__input form__input--sm"
            type="number"
            placeholder="Giá VND"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <button type="submit" className="btn btn--rounded btn--yellow">
            Thêm
          </button>
        </form>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th align="left">Mã</th>
              <th align="left">Tên</th>
              <th align="right">Giá</th>
              <th align="right">Tồn</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderTop: "1px solid #eee" }}>
                <td>{p.legacy_id || p.id.slice(0, 8)}</td>
                <td>{p.name}</td>
                <td align="right">{formatVnd(Number(p.current_price))}</td>
                <td align="right">{p.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default AdminProducts;
