// src/pages/api/personal/getOrders.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { addDays, startOfDay, endOfDay } from "date-fns"; // Librería para manipular fechas

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { branchId } = req.query; // Obtener branchId de los parámetros de consulta

    // Calcular los rangos de fechas (hoy y mañana)
    const today = startOfDay(new Date()); // Inicio del día actual
    const tomorrow = endOfDay(addDays(today, 1)); // Final del día siguiente

    try {
      const pedidos = await prisma.pedido.findMany({
        where: {
          items: {
            some: {
              Product: {
                branchId: Number(branchId),
              },
            },
          },
          status: {
            not: "cancelado", // Excluir los pedidos cancelados
          },
          createdAt: {
            gte: today, // Fecha mayor o igual al inicio del día de hoy
            lte: tomorrow, // Fecha menor o igual al final del día de mañana
          },
        },
        include: {
          items: {
            include: {
              Product: true, // Incluir detalles del producto
            },
          },
          User: {
            select: {
              fullName: true,
              phone: true,
              address: true,
              Referencia: true,
            },
          },
        },
      });

      res.status(200).json(pedidos);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      res.status(500).json({ message: "Error al obtener pedidos", error });
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}
