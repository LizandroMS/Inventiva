// src/pages/api/products/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { id, name, description, price, promotional_price, stock, status, familia, branchId, imagenUrl } = req.body;

    // Validar que los datos esenciales están presentes
    if (!id || !name || !price || !stock || !status || !familia || !branchId) {
      return res.status(400).json({ message: "Faltan campos requeridos para la actualización" });
    }

    try {
      // Actualizar el producto
      const updatedProduct = await prisma.product.update({
        where: { id: Number(id) },
        data: {
          name,
          description,
          price: parseFloat(price),
          promotional_price: promotional_price ? parseFloat(promotional_price) : null,
          stock: parseInt(stock, 10),
          status,
          familia,
          branchId: Number(branchId),
          imagenUrl
        },
      });

      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      res.status(500).json({ message: "Error al actualizar el producto" });
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}
