import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { fullName, email, password, address, phone, dni, birthDate } = req.body;

    if (!fullName || !email || !password || !address || !phone || !dni || !birthDate) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
      // Hashear la contraseña antes de almacenarla
      const hashedPassword = await bcrypt.hash(password, 10);

      // Intentar crear un nuevo usuario
      const newUser = await prisma.user.create({
        data: {
          fullName,
          email,
          password: hashedPassword,
          address,
          phone,
          dni,
          birthDate: new Date(birthDate),
        },
      });

      return res.status(201).json(newUser);
    } catch (error) {
      // Capturamos el error de unicidad (correo ya registrado)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002' && error.meta?.target === 'User_email_key') {
          return res.status(409).json({ error: 'Este correo ya está registrado' });
        }
      }

      console.error("Error al crear el usuario:", error);
      return res.status(500).json({ error: 'Error al registrar el usuario' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${req.method} no permitido`);
  }
}
