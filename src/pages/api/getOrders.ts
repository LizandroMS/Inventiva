import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { subDays, startOfDay, endOfDay } from 'date-fns'; // Para manipular fechas

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const { id } = req.query;

    // Validar que se proporcione un ID de usuario
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: 'ID de usuario inválido o no proporcionado.' });
    }

    // Definir rangos de fechas para hoy y ayer
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const yesterdayStart = startOfDay(subDays(new Date(), 1));
    const yesterdayEnd = endOfDay(subDays(new Date(), 1));

    // Buscar los pedidos del usuario dentro de los rangos de fecha y que no estén cancelados o entregados
    const orders = await prisma.pedido.findMany({
      where: {
        userId: Number(id),
        NOT: {
          status: {
            in: ['CANCELADO', 'ENTREGADO'], // Excluir pedidos con estos estados
          },
        },
        OR: [
          {
            createdAt: {
              gte: yesterdayStart,
              lte: yesterdayEnd,
            },
          },
          {
            createdAt: {
              gte: todayStart,
              lte: todayEnd,
            },
          },
        ],
      },
      include: {
        items: {
          include: {
            Product: true, // Incluir los detalles del producto en cada item
          },
        },
      },
    });

    // Devolver los pedidos encontrados
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    res.status(500).json({ message: 'Error al obtener los pedidos', error });
  }
}
