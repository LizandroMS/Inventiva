// src/pages/api/products/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  console.log(" PUT ---> ", req.body)
  if (req.method === "POST") {
    const { id, name, description, price, promotional_price, stock, status, familia, branchId } = req.body;

    try {
      const updatedProduct = await prisma.product.update({
        where: { id: Number(id) },
        data: { name, description, price, promotional_price, stock, status, familia, branchId },
      });

      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el producto" });
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}
