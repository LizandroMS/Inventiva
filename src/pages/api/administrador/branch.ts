// src/pages/api/branch.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, address, phone } = req.body;

    // Validar los datos
    if (!name || !address || !phone) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
      // Crear la nueva sucursal en la base de datos
      const branch = await prisma.branch.create({
        data: {
          name,
          address,
          phone,
        },
      });

      return res.status(201).json(branch);
    } catch (error) {
      console.error("Error al guardar la sucursal:", error);
      return res.status(500).json({ error: "Error al guardar la sucursal" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Método ${req.method} no permitido`);
  }
}
