// src/pages/api/createOrder.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { userId, items, totalAmount } = req.body;
      console.log(" items --> ",items)
      // Crear el pedido y los items en la base de datos
      const order = await prisma.pedido.create({
        data: {
          userId,
          totalAmount,
          status: 'PENDIENTE',
          items: {
            create: items.map((item: { id: number; quantity: number; price: number; promotional_price: number | null; productName: string; familia: string; observation: string; imagenUrl: string; description: string }) => ({
              productId: item.id,                   // Guardar el productId como referencia
              productName: item.productName,        // Guardamos el nombre del producto
              price: item.price,                    // Guardamos el precio
              promotional_price: item.promotional_price, // Guardamos el precio promocional si existe
              familia: item.familia,                // Guardamos la familia del producto
              quantity: item.quantity,              // Guardamos la cantidad
              totalPrice: (item.promotional_price || item.price) * item.quantity, // Calculamos el precio total
              observation: item.observation || '',  // Guardamos la observación si existe
              imagenUrl: item.imagenUrl || '',      // Guardar la URL de la imagen si existe
              description: item.description || ''   // Guardar la descripción si existe
            })),
          },
        },
        include: {
          items: true, // Incluir los items en la respuesta
        },
      });

      res.status(201).json(order);
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      res.status(500).json({ message: 'Error al crear el pedido', error });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
