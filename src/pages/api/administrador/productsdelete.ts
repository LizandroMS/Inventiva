import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("DELETE",req.method)
  if (req.method === "DELETE") {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Falta el ID del producto" });
    }

    try {
      // Verificar si el producto existe
      const product = await prisma.product.findUnique({
        where: { id: Number(id) },
      });

      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      // Eliminar el producto
      await prisma.product.delete({
        where: { id: Number(id) },
      });

      res.status(200).json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
