import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
        }

        try {
            // Buscar al usuario por correo
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            // Verificar la contraseña
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Contraseña incorrecta' });
            }

            // Generar un token JWT
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role, branchId: user.branchId }, // Payload
                'secret-key', // Clave secreta (deberías usar una clave segura en producción)
                { expiresIn: '1h' } // Expiración del token
            );

            // Enviar el token junto con los datos del usuario
            return res.status(200).json({
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                token, // Incluir el token en la respuesta
            });
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            return res.status(500).json({ error: 'Error al iniciar sesión' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Método ${req.method} no permitido`);
    }
}
