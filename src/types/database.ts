export type DbProfile = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  role: "user" | "admin";
  created_at: string;
};

export type DbCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
};

export type DbProduct = {
  id: string;
  legacy_id: string | null;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  discount: number;
  current_price: number;
  quantity: number;
  colors: string[];
  sizes: string[];
  images: string[];
  rating: number;
  created_at: string;
  categories?: { name: string; slug: string } | null;
};

export type DbOrder = {
  id: string;
  user_id: string | null;
  order_code: string;
  full_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string | null;
  country: string;
  total_amount: number;
  payment_method: string | null;
  shipping_method: string | null;
  status: string;
  created_at: string;
};

export type DbOrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  price: number;
  quantity: number;
  color: string | null;
  size: string | null;
};
