import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { branchId } = req.query;

  if (req.method === 'GET') {
    try {
      const pedidos = await prisma.pedido.findMany({
        where: {
          items: {
            some: {
              Product: {
                branchId: Number(branchId), // Asegúrate de convertir branchId a número
              },
            },
          },
        },
        include: {
          items: {
            include: {
              Product: true, // Incluir detalles del producto
            },
          },
        },
      });

      res.status(200).json(pedidos);
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
      res.status(500).json({ message: 'Error al obtener los pedidos', error });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
