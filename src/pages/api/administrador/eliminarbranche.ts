import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method === "POST") {
      const { id } = req.body; // Ahora extraemos el ID desde el cuerpo de la solicitud
  
      if (!id) {
        return res.status(400).json({ error: "ID de sucursal es requerido." });
      }
  
      try {
        await prisma.branch.delete({
          where: { id },
        });
  
        return res.status(200).json({ message: "Sucursal eliminada con éxito." });
      } catch (error) {
        console.error("Error al eliminar la sucursal:", error);
        return res.status(500).json({
          error: "Error al eliminar la sucursal. Verifique las relaciones.",
        });
      }
    } else {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Método ${req.method} no permitido`);
    }
  }
  