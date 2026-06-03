import type { NextApiRequest, NextApiResponse } from "next";

import { fetchProductsFromDb, getMockProducts } from "@/lib/products-db";

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  const fromDb = await fetchProductsFromDb();
  const products = fromDb ?? getMockProducts();

  res.status(200).json(products);
};
