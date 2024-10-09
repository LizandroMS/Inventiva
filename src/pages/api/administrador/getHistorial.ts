import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { fechaInicio, fechaFin, familia, estado, page = 1, limit = 15 } = req.body;

    // Convertir las fechas a UTC para abarcar todo el día
    const startDate = new Date(new Date(fechaInicio).setUTCHours(0, 0, 0, 0)); // Inicio del día en UTC
    const endDate = new Date(new Date(fechaFin).setUTCHours(23, 59, 59, 999)); // Fin del día en UTC

    const skip = (page - 1) * limit; // Calcular cuántos registros omitir
    const take = limit; // Limitar a `limit` registros

    try {
      const orders = await prisma.pedido.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          status: estado ? estado : undefined, // Filtrar por estado si se proporciona
          items: {
            some: {
              OR: [
                {
                  Product: {
                    familia: familia ? familia : undefined, // Filtrar por familia de Product si existe
                  },
                },
                {
                  familia: familia ? familia : undefined, // Filtrar por familia en `OrderItem`
                },
              ],
            },
          },
        },
        include: {
          items: {
            include: {
              Product: true, // Incluir detalles del producto si existen
            },
          },
          User: {
            select: {
              fullName: true,
              phone: true,
            },
          },
        },
        skip, // Omitir registros
        take, // Limitar a `limit` registros
      });

      // Obtener el número total de pedidos para la paginación
      const totalOrders = await prisma.pedido.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          status: estado ? estado : undefined, // Contar también con el filtro de estado
          items: {
            some: {
              OR: [
                {
                  Product: {
                    familia: familia ? familia : undefined,
                  },
                },
                {
                  familia: familia ? familia : undefined, // Considerar `familia` en `OrderItem`
                },
              ],
            },
          },
        },
      });

      res.status(200).json({ orders, totalOrders });
    } catch (error) {
      console.error('Error al obtener los pedidos:', error);
      res.status(500).json({ message: 'Error al obtener los pedidos', error });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
