import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { fechaInicio, fechaFin, familia } = req.body;

    // Convertir las fechas a UTC
    const startDate = new Date(new Date(fechaInicio).setUTCHours(0, 0, 0, 0)); // Inicio del día en UTC
    const endDate = new Date(new Date(fechaFin).setUTCHours(23, 59, 59, 999)); // Fin del día en UTC

    console.log("Fechas UTC recibidas:", startDate.toISOString(), endDate.toISOString());

    try {
      const orders = await prisma.pedido.findMany({
        where: {
          createdAt: {
            gte: startDate, // Filtrar pedidos desde el inicio del día en UTC
            lte: endDate, // Filtrar pedidos hasta el final del día en UTC
          },
          items: {
            some: {
              Product: {
                familia: familia ? familia : undefined, // Filtrar por familia si está definida
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
          User: { // Incluir detalles del usuario
            select: {
              fullName: true,
              phone: true,
            },
          },
        },
      });

      res.status(200).json(orders);
    } catch (error) {
      console.error('Error al obtener los pedidos:', error);
      res.status(500).json({ message: 'Error al obtener los pedidos', error });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
