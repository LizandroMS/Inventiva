// /pages/api/addAddress.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, address, referencia } = req.body;

    if (!userId || !address) {
      return res.status(400).json({ error: 'El ID de usuario y la dirección son requeridos.' });
    }

    try {
      const newAddress = await prisma.address.create({
        data: {
          address,
          referencia,
          userId,
          isActive: false, // La nueva dirección no es activa por defecto
        },
      });

      return res.status(201).json(newAddress);
    } catch (error) {
      console.error('Error al agregar la dirección:', error);
      return res.status(500).json({ error: 'Ocurrió un error al agregar la dirección.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${req.method} no permitido.`);
  }
}
