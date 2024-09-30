import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { branchId } = req.body;
        console.log("branchId",branchId)
        if (!branchId) {
            return res.status(400).json({ message: 'branchId es requerido' });
        }

        try {
            const products = await prisma.product.findMany({
                where: branchId ? { branchId: Number(branchId) } : {},
            });

            if (products.length === 0) {
                return res.status(404).json({ message: 'No se encontraron productos para esta sucursal' });
            }

            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los productos' });
        }
    } else {
        res.status(405).json({ message: 'Método no permitido' });
    }
}
