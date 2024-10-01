// src/pages/api/personal/updateOrderStatus.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { id, nuevoEstado } = req.body;

    try {
      // Actualizar el estado del pedido
      await prisma.pedido.update({
        where: { id: Number(id) },
        data: { status: nuevoEstado },
      });

      res.status(200).json({ message: "Estado actualizado" });
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      res.status(500).json({ message: "Error al actualizar el estado" });
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}
