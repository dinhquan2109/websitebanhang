import type { DbProduct } from "@/types/database";
import type { ProductType, ProductTypeList } from "@/types";

const defaultVotes = [
  { value: 1, count: 1 },
  { value: 2, count: 10 },
  { value: 3, count: 10 },
  { value: 4, count: 20 },
  { value: 5, count: 40 },
];

const defaultReviews = [
  {
    name: "Khách hàng",
    avatar: "/images/featured-1.jpg",
    description:
      "<p>Chất liệu cotton thoáng mát, form vừa vặn. Phù hợp mặc hằng ngày hoặc đi chơi.</p>",
    punctuation: 5,
  },
];

export function dbProductToApiProduct(row: DbProduct): ProductType {
  const publicId = row.legacy_id || row.id;
  const categoryName =
    (row.categories as { name?: string } | null)?.name || "Áo thun";

  return {
    id: publicId,
    name: row.name,
    thumb: row.images?.[0] || "/images/products/product-1.jpg",
    price: String(row.price),
    count: 1,
    color: row.colors?.[0] || "#000",
    size: row.sizes?.[0] || "l",
    images: row.images?.length ? row.images : ["/images/products/product-1.jpg"],
    discount: row.discount > 0 ? String(row.discount) : undefined,
    currentPrice: Number(row.current_price),
    punctuation: {
      countOpinions: 81,
      punctuation: Number(row.rating) || 4.5,
      votes: defaultVotes,
    },
    reviews: defaultReviews,
    category: categoryName,
    quantityAvailable: row.quantity,
  } as ProductType & { category?: string; quantityAvailable?: number };
}

export function dbProductToListItem(row: DbProduct): ProductTypeList {
  const publicId = row.legacy_id || row.id;
  return {
    id: publicId,
    name: row.name,
    price: String(row.price),
    color: row.colors?.[0] || "#000",
    images: row.images?.length ? row.images : ["/images/products/product-1.jpg"],
    discount: row.discount > 0 ? String(row.discount) : undefined,
    currentPrice: Number(row.current_price),
  };
}
