// src/pages/api/products/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page = 1 } = req.query; // Recibe el parámetro de la página
  const itemsPerPage = 15;
  const skip = (Number(page) - 1) * itemsPerPage;

  try {
    const products = await prisma.product.findMany({
      skip,
      take: itemsPerPage,
      orderBy: { created_at: "desc" },
    });

    const totalProducts = await prisma.product.count();
    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    res.status(200).json({ products, totalPages });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos" });
  }
}
