import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id } = req.query; 
    try {
      const orders = await prisma.pedido.findMany({
        where: {
          userId: Number(id),
        },
        include: {
          items: {
            include: {
              Product: true, // Incluir detalles del producto
            },
          },
        },
      });

      res.status(200).json(orders);
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
      res.status(500).json({ message: 'Error al obtener los pedidos', error });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
