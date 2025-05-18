import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.body;

  if (!id) return res.status(400).json({ message: 'ID requerido' });

  try {
    // Paso 1: Eliminar reclamos
    await prisma.claimBook.deleteMany({
      where: { userId: id },
    });

    // Paso 2: Eliminar direcciones
    await prisma.address.deleteMany({
      where: { userId: id },
    });

    // Paso 3: Eliminar órdenes y sus items
    const pedidos = await prisma.pedido.findMany({
      where: { userId: id },
      select: { id: true },
    });

    const pedidoIds = pedidos.map(p => p.id);

    if (pedidoIds.length > 0) {
      await prisma.orderItem.deleteMany({
        where: { orderId: { in: pedidoIds } },
      });

      await prisma.pedido.deleteMany({
        where: { id: { in: pedidoIds } },
      });
    }

    // Paso 4: Finalmente eliminar al usuario
    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Usuario y datos relacionados eliminados correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error interno', error: error });
  }
}
