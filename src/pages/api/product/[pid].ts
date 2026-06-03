import type { NextApiRequest, NextApiResponse } from "next";

import { fetchProductByPublicId, getMockProducts } from "@/lib/products-db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { pid },
  } = req;

  const id = String(pid);
  const fromDb = await fetchProductByPublicId(id);

  if (fromDb) {
    return res.status(200).json(fromDb);
  }

  const mock = getMockProducts().find((x) => x.id === id);
  if (!mock) {
    return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
  }

  return res.status(200).json(mock);
};
