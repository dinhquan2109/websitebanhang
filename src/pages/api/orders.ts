import type { NextApiRequest, NextApiResponse } from "next";

import { getBearerToken, getSupabaseAsUser } from "@/lib/supabase-auth";
import { getSupabaseServerClient } from "@/lib/supabase";
import {
  fetchProductByPublicId,
  resolveProductUuid,
} from "@/lib/products-db";

type OrderItemInput = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
};

type CreateOrderBody = {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city?: string;
  country?: string;
  paymentMethod?: string;
  shippingMethod?: string;
  items: OrderItemInput[];
};

function generateOrderCode(): string {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.floor(1000 + Math.random() * 9000);
  return `DH-${t}-${r}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: "Cần đăng nhập để đặt hàng" });
  }

  const userClient = getSupabaseAsUser(token);
  if (!userClient) {
    return res.status(503).json({ error: "Supabase chưa cấu hình" });
  }

  const {
    data: { user },
    error: userErr,
  } = await userClient.auth.getUser(token);

  if (userErr || !user) {
    return res.status(401).json({ error: "Phiên đăng nhập không hợp lệ" });
  }

  if (req.method === "GET") {
    const { data: orders, error } = await userClient
      .from("orders")
      .select(
        `
        *,
        order_items (*)
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ orders: orders ?? [] });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body as CreateOrderBody;
  if (!body?.items?.length || !body.fullName || !body.phone || !body.address) {
    return res.status(400).json({ error: "Thiếu thông tin đơn hàng" });
  }

  const serverClient = getSupabaseServerClient();
  const lineItems: {
    product_id: string | null;
    product_name: string;
    price: number;
    quantity: number;
    color: string | null;
    size: string | null;
  }[] = [];
  let total = 0;

  for (const item of body.items) {
    const dbProduct = serverClient
      ? await fetchProductByPublicId(item.productId, serverClient)
      : null;

    const unitPrice = dbProduct
      ? Number(dbProduct.currentPrice)
      : Number(item.price);

    if (!unitPrice || unitPrice <= 0) {
      return res.status(400).json({
        error: `Giá sản phẩm không hợp lệ: ${item.productId}`,
      });
    }

    const qty = Math.max(1, Math.floor(item.quantity));
    total += unitPrice * qty;

    const productUuid = serverClient
      ? await resolveProductUuid(item.productId, serverClient)
      : null;

    lineItems.push({
      product_id: productUuid,
      product_name: dbProduct?.name || item.name,
      price: unitPrice,
      quantity: qty,
      color: item.color || null,
      size: item.size || null,
    });
  }

  const orderCode = generateOrderCode();

  const { data: order, error: orderErr } = await userClient
    .from("orders")
    .insert({
      user_id: user.id,
      order_code: orderCode,
      full_name: body.fullName.trim(),
      phone: body.phone.trim(),
      email: body.email?.trim() || user.email,
      address: body.address.trim(),
      city: body.city?.trim() || null,
      country: body.country?.trim() || "VN",
      total_amount: total,
      payment_method: body.paymentMethod || "cod",
      shipping_method: body.shippingMethod || "standard",
      status: "pending",
    })
    .select("id")
    .single();

  if (orderErr || !order) {
    return res.status(500).json({
      error: orderErr?.message || "Không tạo được đơn hàng",
      hint: "Đã chạy supabase/schema.sql trên Supabase chưa?",
    });
  }

  const { error: itemsErr } = await userClient.from("order_items").insert(
    lineItems.map((row) => ({
      order_id: order.id,
      ...row,
    })),
  );

  if (itemsErr) {
    return res.status(500).json({ error: itemsErr.message });
  }

  return res.status(201).json({
    orderId: order.id,
    orderCode,
    totalAmount: total,
  });
}
