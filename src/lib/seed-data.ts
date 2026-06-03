import mockProducts from "@/utils/data/products";

export const SEED_CATEGORY = {
  name: "Áo thun",
  slug: "ao-thun",
  description: "Áo thun nam nữ",
  image_url: "/images/products/product-1.jpg",
};

export function buildSeedProducts(categoryId: string) {
  return mockProducts.map((p) => {
    const price = Number(p.price);
    const currentPrice = Number(p.currentPrice ?? p.price);
    const discount = p.discount ? Number(p.discount) : 0;
    const slug = `san-pham-${p.id}`;

    return {
      legacy_id: String(p.id),
      category_id: categoryId,
      name: p.name,
      slug,
      description: `Sản phẩm ${p.name}`,
      price,
      discount,
      current_price: currentPrice,
      quantity: p.quantityAvailable ?? 10,
      colors: p.colors ?? ["#000"],
      sizes: p.sizes ?? ["l", "xl"],
      images: p.images ?? ["/images/products/product-1.jpg"],
      rating: p.punctuation?.punctuation ?? 4.5,
    };
  });
}
