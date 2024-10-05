// src/pages/api/registroProducto.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    console.log("cuerpo de registro ", req.body)
    const { nombreProducto, descripcion, precio, precioPromocional, stock, estado, fechaCreacion, creadoPor, branchId, imagenUrl, familia } = req.body;

    // Validar los campos necesarios
    if (!nombreProducto || !precio || !stock || !branchId) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
      // Crear un nuevo producto en la base de datos
      const nuevoProducto = await prisma.product.create({
        data: {
          name: nombreProducto,
          description: descripcion || null,
          price: parseFloat(precio),
          promotional_price: precioPromocional ? parseFloat(precioPromocional) : null,
          stock: parseInt(stock, 10),
          status: estado,
          created_at: new Date(fechaCreacion),
          created_by: creadoPor,
          branchId: parseInt(branchId, 10),
          imagenUrl: imagenUrl,
          familia: familia
        },
      });

      // Responder con el producto creado
      return res.status(201).json(nuevoProducto);
    } catch (error) {
      console.error("Error al registrar producto:", error);
      return res.status(500).json({ error: "Error al registrar producto" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Método ${req.method} no permitido`);
  }
}
