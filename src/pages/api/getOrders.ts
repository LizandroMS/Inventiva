import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { subDays, startOfDay, endOfDay } from 'date-fns'; // Para manipular fechas

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id } = req.query;

    // Obtener el inicio y fin de hoy
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    // Obtener el inicio y fin de ayer
    const yesterdayStart = startOfDay(subDays(new Date(), 1));
    const yesterdayEnd = endOfDay(subDays(new Date(), 1));

    try {
      const orders = await prisma.pedido.findMany({
        where: {
          userId: Number(id), // Filtrar por el userId si es necesario
          OR: [
            {
              createdAt: {
                gte: yesterdayStart, // Pedidos desde ayer a las 00:00
                lte: yesterdayEnd, // Pedidos hasta ayer a las 23:59
              },
            },
            {
              createdAt: {
                gte: todayStart, // Pedidos desde hoy a las 00:00
                lte: todayEnd, // Pedidos hasta hoy a las 23:59
              },
            },
          ],
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
