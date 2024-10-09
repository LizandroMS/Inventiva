import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { id, fullName, email, phone, dni, addresses } = req.body;

    try {
      // Actualizar los detalles del usuario
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: {
          fullName,
          email,
          phone,
          dni,
          addresses: {
            deleteMany: {}, // Eliminar las direcciones existentes para reemplazarlas
            create: addresses.map((address: { address: string, referencia: string }) => ({
              address: address.address,
              referencia: address.referencia,
            })),
          },
        },
        include: {
          addresses: true, // Devolver las direcciones actualizadas
          branch: true, // Incluir la sucursal
        },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
