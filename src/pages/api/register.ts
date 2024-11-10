import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { fullName, email, password, phone, birthDate, addresses } = req.body;

    if (!fullName || !email || !password || !phone || !birthDate || !addresses || addresses.length === 0) {
      return res.status(400).json({ error: 'Faltan campos requeridos o no se ha proporcionado ninguna dirección' });
    }
    // Validar que al menos una dirección esté marcada como activa
    const hasActiveAddress = addresses.some((addr: { isActive: boolean }) => addr.isActive);
    if (!hasActiveAddress) {
      return res.status(400).json({ error: 'Debes marcar al menos una dirección como activa' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear el nuevo usuario con direcciones
      const newUser = await prisma.user.create({
        data: {
          fullName,
          email,
          password: hashedPassword,
          phone,
          birthDate: new Date(birthDate),
          addresses: {
            create: addresses.map((addr: { address: string; referencia: string; isActive: boolean }) => ({
              address: addr.address,
              referencia: addr.referencia,
              isActive: addr.isActive || false, // Marca todas como no activas por defecto
            })),
          },
        },
        include: {
          addresses: true,
        },
      });

      // Si se ha marcado una dirección como activa, desactivar todas las demás y actualizar solo esa
      const activeAddress = addresses.find((addr: { isActive: boolean }) => addr.isActive);
      if (activeAddress) {
        await prisma.address.updateMany({
          where: {
            userId: newUser.id,
            isActive: true, // Desactiva todas las demás direcciones activas
          },
          data: { isActive: false },
        });

        // Activar la dirección correspondiente
        const activeAddressInDb = newUser.addresses.find(
          (addr) => addr.address === activeAddress.address && addr.referencia === activeAddress.referencia
        );

        if (activeAddressInDb) {
          await prisma.address.update({
            where: { id: activeAddressInDb.id },
            data: { isActive: true },
          });
        }
      }

      // Generar un token JWT para el usuario recién creado
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role, branchId: newUser.branchId }, // Payload
        'secret-key', // Clave secreta (deberías usar una clave segura en producción)
        { expiresIn: '8h' } // Expiración del token
      );

      // Enviar el token junto con los datos del usuario, incluyendo direcciones
      return res.status(201).json({
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        branchId: newUser.branchId,
        token, // Incluir el token en la respuesta
        addresses: newUser.addresses, // Incluir las direcciones en la respuesta
        birthDate: newUser.birthDate,
        dni: newUser.dni,
        phone: newUser.phone,
      });

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002' && error.meta?.target === 'User_email_key') {
          return res.status(409).json({ error: 'Este correo ya está registrado' });
        }
      }
      return res.status(500).json({ error: 'Error al registrar el usuario' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${req.method} no permitido`);
  }
}
