// src/pages/api/personal/updateOrderStatus.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Definir las transiciones de estado permitidas
const allowedTransitions: { [key: string]: string[] } = {
  PENDIENTE: ["PREPARANDO"],
  PREPARANDO: ["DRIVER"],
  DRIVER: ["ENTREGADO"],
  // ENTREGADO y CANCELADO no permiten transiciones adicionales
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { id, nuevoEstado } = req.body;

    try {
      // Obtener el estado actual del pedido
      const pedidoActual = await prisma.pedido.findUnique({
        where: { id: Number(id) },
        select: { status: true },
      });

      if (!pedidoActual) {
        return res.status(404).json({ message: "Pedido no encontrado" });
      }

      const estadoActual = pedidoActual.status;

      // Verificar si la transición de estado es permitida
      const estadosPermitidos = allowedTransitions[estadoActual] || [];
      if (!estadosPermitidos.includes(nuevoEstado)) {
        return res.status(400).json({
          message: `No se puede cambiar el estado de ${estadoActual} a ${nuevoEstado}`,
        });
      }

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
