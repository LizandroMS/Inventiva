import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client"; // Asegúrate de que tienes tu cliente Prisma configurado
const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId } = req.query; // Obtener el userId desde los query params

    if (!userId) {
      return res.status(400).json({ error: 'Se requiere el userId' });
    }
    try {
      const claims = await prisma.claimBook.findMany({
        where: {
          userId: Number(userId), // Asegúrate de que userId es un número
        },
        include: {
          user: true, // Incluir información del usuario relacionado
        },
      });
      return res.status(200).json(claims);
    } catch (error) {
      return res.status(500).json({ error: 'Error obteniendo los reclamos' });
    }
  }

  if (req.method === 'POST') {
    // Crear un nuevo reclamo
    const { userId, reason, description } = req.body;

    try {
      const newClaim = await prisma.claimBook.create({
        data: {
          userId: Number(userId), // Asegúrate de que userId es un número
          reason,
          description,
        },
      });
      return res.status(201).json(newClaim);
    } catch (error) {
      return res.status(500).json({ error: 'Error creando el reclamo' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}