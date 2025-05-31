// pages/api/auth/forgot-password.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client';

import crypto from "crypto";
import nodemailer from 'nodemailer';
const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Método no permitido" });

  const { email } = req.body;

  try {
    // 1. Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "Correo no registrado" });
    }

    // ✅ Puedes hacer aquí procesos adicionales con `user`
    console.log("Usuario completo:", user);

    // 2. Generar token y expiración
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    // 3. Guardar el token en tabla temporal (la creamos después si deseas)
    await prisma.passwordResetToken.create({
      data: {
        email: user.email,
        token,
        expiresAt,
      },
    });

    // 4. Preparar enlace de recuperación
    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

    // 5. Enviar correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "polleriaelsabrosito14@gmail.com",//process.env.EMAIL_USER,
        pass: "bpga onox xzbz urjv"//process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: "polleriaelsabrosito14@gmail.com",//process.env.EMAIL_USER,
      to: user.email,
      subject: "Recuperación de contraseña",
      html: `
        <h2>Hola ${user.fullName},</h2>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    });

    return res.status(200).json({ message: "Correo de recuperación enviado" });
  } catch (err) {
    console.error("Error en recuperación:", err);
    return res.status(500).json({ message: "Error al procesar la solicitud" });
  }
}
