import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { fullName, email, password, phone, dni, birthDate, branchId, addresses } = req.body;

    if (!fullName || !email || !password || !phone || !dni || !birthDate || !addresses || addresses.length === 0) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios, incluidas las direcciones' });
    }

    try {
      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(409).json({ error: 'El correo ya está registrado' });
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear el nuevo personal en la base de datos junto con las direcciones
      const newUser = await prisma.user.create({
        data: {
          fullName,
          email,
          password: hashedPassword,
          phone,
          dni,
          birthDate: new Date(birthDate), // Asegurarnos de que la fecha se almacene como objeto Date
          role: 'personal', // Asignar el rol automáticamente como 'personal'
          branchId: parseInt(branchId, 10),
          addresses: {
            create: addresses.map((addr: { address: string; referencia: string; isActive: boolean }) => ({
              address: addr.address,
              referencia: addr.referencia,
              isActive: addr.isActive,
            })),
          },
        },
        include: {
          addresses: true,
        },
      });

      // Si hay una dirección marcada como activa, asegurarnos de desactivar las demás
      const activeAddress = addresses.find((addr: { isActive: boolean }) => addr.isActive);
      if (activeAddress) {
        await prisma.address.updateMany({
          where: { userId: newUser.id, NOT: { address: activeAddress.address } },
          data: { isActive: false },
        });
      }

      return res.status(201).json({
        message: 'Personal registrado correctamente',
        user: newUser,
      });
    } catch (error) {
      console.error('Error al registrar personal:', error);
      return res.status(500).json({ error: 'Ocurrió un error en el servidor' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${req.method} no permitido`);
  }
}
