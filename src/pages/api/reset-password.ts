import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Método no permitido" });

  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Token y nueva contraseña son requeridos." });
  }

  try {
    // Buscar el token
    const tokenEntry = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!tokenEntry) {
      return res.status(400).json({ message: "Token inválido." });
    }

    if (tokenEntry.expiresAt < new Date()) {
      return res.status(400).json({ message: "El token ha expirado." });
    }

    // Buscar al usuario por email
    const user = await prisma.user.findUnique({
      where: { email: tokenEntry.email },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar contraseña
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Eliminar el token
    await prisma.passwordResetToken.delete({
      where: { token },
    });

    return res.status(200).json({ message: "Contraseña actualizada correctamente." });
  } catch (err) {
    console.error("Error al actualizar contraseña:", err);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
}
