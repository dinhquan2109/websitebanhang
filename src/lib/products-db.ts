import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseServerClient } from "@/lib/supabase";
import type { DbProduct } from "@/types/database";
import { dbProductToApiProduct, dbProductToListItem } from "@/utils/product-mapper";
import mockProducts from "@/utils/data/products";
import type { ProductType } from "@/types";

const PRODUCT_SELECT = `
  *,
  categories ( name, slug )
`;

export async function fetchProductsFromDb(
  client?: SupabaseClient | null,
): Promise<ProductType[] | null> {
  const supabase = client ?? getSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: true });

  if (error || !data?.length) {
    return null;
  }

  return (data as DbProduct[]).map((row) => dbProductToApiProduct(row));
}

export async function fetchProductByPublicId(
  publicId: string,
  client?: SupabaseClient | null,
): Promise<ProductType | null> {
  const supabase = client ?? getSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  let query = supabase.from("products").select(PRODUCT_SELECT);

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      publicId,
    );

  if (isUuid) {
    query = query.eq("id", publicId);
  } else {
    query = query.eq("legacy_id", publicId);
  }

  const { data, error } = await query.maybeSingle();

  if (error || !data) {
    return null;
  }

  return dbProductToApiProduct(data as DbProduct);
}

export async function resolveProductUuid(
  publicId: string,
  client?: SupabaseClient | null,
): Promise<string | null> {
  const supabase = client ?? getSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      publicId,
    );

  const query = isUuid
    ? supabase.from("products").select("id").eq("id", publicId)
    : supabase.from("products").select("id").eq("legacy_id", publicId);

  const { data } = await query.maybeSingle();
  return data?.id ?? null;
}

function mockRowToProductType(
  p: (typeof mockProducts)[number],
): ProductType {
  return {
    id: String(p.id),
    name: p.name,
    thumb: p.images?.[0] || "/images/products/product-1.jpg",
    price: String(p.price),
    count: 1,
    color: p.colors?.[0] || "#000",
    size: p.sizes?.[0] || "l",
    images: p.images ?? ["/images/products/product-1.jpg"],
    discount: p.discount ? String(p.discount) : undefined,
    currentPrice: Number(p.currentPrice ?? p.price),
    punctuation: p.punctuation,
    reviews: p.reviews,
  };
}

export function getMockProducts(): ProductType[] {
  return mockProducts.map(mockRowToProductType);
}

export async function getProductsList(
  client?: SupabaseClient | null,
): Promise<ReturnType<typeof dbProductToListItem>[]> {
  const supabase = client ?? getSupabaseServerClient();
  if (!supabase) {
    return mockProducts.map((p) => ({
      id: String(p.id),
      name: p.name,
      price: String(p.price),
      color: p.colors?.[0] || "#000",
      images: p.images,
      discount: p.discount ? String(p.discount) : undefined,
      currentPrice: Number(p.currentPrice ?? p.price),
    }));
  }

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: true });

  if (error || !data?.length) {
    return mockProducts.map((p) => ({
      id: String(p.id),
      name: p.name,
      price: String(p.price),
      color: p.colors?.[0] || "#000",
      images: p.images,
      discount: p.discount ? String(p.discount) : undefined,
      currentPrice: Number(p.currentPrice ?? p.price),
    }));
  }

  return (data as DbProduct[]).map((row) => dbProductToListItem(row));
}
