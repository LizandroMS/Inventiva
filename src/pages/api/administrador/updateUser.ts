import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { id, fullName, email, phone, dni, addresses, branchId } = req.body;

    try {
      // Actualizar los detalles del usuario, incluyendo direcciones y la sucursal si aplica
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: {
          fullName,
          email,
          phone,
          dni,
          branch: branchId
            ? {
                connect: { id: Number(branchId) },
              }
            : {
                disconnect: true, // Desconectar la sucursal si no se proporciona
              },
          addresses: {
            deleteMany: {}, // Eliminar todas las direcciones actuales para crear nuevas
            create: addresses.map(
              (address: { address: string; referencia: string; isActive: boolean }) => ({
                address: address.address,
                referencia: address.referencia,
                isActive: address.isActive, // Guardar el estado de dirección activa
              })
            ),
          },
        },
        include: {
          addresses: true, // Devolver las direcciones actualizadas
          branch: true, // Incluir la sucursal actualizada
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
