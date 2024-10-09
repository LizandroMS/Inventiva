import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Obtener todos los usuarios con sus direcciones y sucursales (si las tienen)
      const users = await prisma.user.findMany({
        include: {
          addresses: true, // Incluir direcciones del usuario
          branch: true, // Incluir la sucursal si el usuario pertenece a una
        },
      });
      res.status(200).json(users);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
