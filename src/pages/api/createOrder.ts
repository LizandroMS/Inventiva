// src/pages/api/createOrder.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { userId, items, totalAmount } = req.body;

      // Crear el pedido y los items en la base de datos
      const order = await prisma.order.create({
        data: {
          userId,
          totalAmount,
          status: 'pending',
          items: {
            create: items.map((item: { id: number; quantity: number; price: number }) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: true, // Incluir los items en la respuesta
        },
      });

      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el pedido', error });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
