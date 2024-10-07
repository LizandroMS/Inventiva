import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, addressId } = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos.' });
    }

    try {
      // Primero, desactivar todas las direcciones del usuario
      await prisma.address.updateMany({
        where: {
          userId: userId,
        },
        data: {
          isActive: false, // Desactiva todas las direcciones
        },
      });

      // Luego, activar solo la dirección seleccionada
      await prisma.address.update({
        where: {
          id: addressId,
        },
        data: {
          isActive: true, // Activa la dirección seleccionada
        },
      });

      return res.status(200).json({ message: 'Dirección actualizada con éxito' });
    } catch (error) {
      console.error('Error al actualizar la dirección activa:', error);
      return res.status(500).json({ error: 'Error al actualizar la dirección activa.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${req.method} no permitido`);
  }
}
