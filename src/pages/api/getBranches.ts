import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const branches = await prisma.branch.findMany(); // Obtener todas las sucursales
      res.status(200).json(branches);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener las sucursales" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
