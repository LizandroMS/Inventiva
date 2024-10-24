import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId, startDate, endDate, page = 1, pageSize = 10 } = req.query;

    // Validación de tipos para los query params
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Se requiere un userId válido' });
    }

    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      return res.status(400).json({ error: 'El userId debe ser un número' });
    }

    // Convertir y validar las fechas
    let start: Date | undefined;
    let end: Date | undefined;
    if (typeof startDate === 'string') {
      start = new Date(startDate);
      if (isNaN(start.getTime())) {
        return res.status(400).json({ error: 'startDate no es una fecha válida' });
      }
    }
    if (typeof endDate === 'string') {
      end = new Date(endDate);
      if (isNaN(end.getTime())) {
        return res.status(400).json({ error: 'endDate no es una fecha válida' });
      }
    }

    // Paginación: validación y conversión a números
    const parsedPage = parseInt(page as string, 10);
    const parsedPageSize = parseInt(pageSize as string, 10);

    if (isNaN(parsedPage) || parsedPage <= 0) {
      return res.status(400).json({ error: 'La página debe ser un número positivo' });
    }
    if (isNaN(parsedPageSize) || parsedPageSize <= 0) {
      return res.status(400).json({ error: 'pageSize debe ser un número positivo' });
    }

    // Configurar el filtro de fecha (si es necesario)
    const whereClause: Prisma.ClaimBookWhereInput = {
      userId: parsedUserId,
    };

    if (start && end) {
      whereClause.createdAt = {
        gte: start,
        lte: end,
      };
    }

    // Paginación: skip (registros a saltar) y take (registros a tomar)
    const skip = (parsedPage - 1) * parsedPageSize;
    const take = parsedPageSize;

    try {
      // Obtener reclamos paginados con información del usuario
      const claims = await prisma.claimBook.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {  // Incluir información del usuario
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true, // Incluye los campos adicionales que necesites
            }
          }
        }
      });

      // Contar el número total de reclamos
      const totalClaims = await prisma.claimBook.count({ where: whereClause });

      return res.status(200).json({ claims, totalClaims });
    } catch (error) {
      return res.status(500).json({ error: 'Error obteniendo los reclamos' });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
