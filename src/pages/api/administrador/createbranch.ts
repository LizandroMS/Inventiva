import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, address, phone, schedules } = req.body;

    // Validar los datos
    if (!name || !address || !phone || !Array.isArray(schedules)) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
      // Crear la nueva sucursal junto con los horarios en la base de datos
      const branch = await prisma.branch.create({
        data: {
          name,
          address,
          phone,
          schedules: {
            create: schedules.map((schedule: { day: string; startTime: string; endTime: string }) => ({
              day: schedule.day,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
            })),
          },
        },
        include: { schedules: true }, // Incluimos los horarios en la respuesta
      });

      return res.status(201).json(branch);
    } catch (error) {
      console.error("Error al guardar la sucursal:", error);
      return res.status(500).json({ error: "Error al guardar la sucursal" });
    }
  } else if (req.method === "PUT") {
    const { id, name, address, phone, schedules } = req.body;

    // Validar los datos
    if (!id || !name || !address || !phone || !Array.isArray(schedules)) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
      // Actualizar la sucursal en la base de datos
      const branch = await prisma.branch.update({
        where: { id },
        data: {
          name,
          address,
          phone,
          schedules: {
            deleteMany: {}, // Eliminamos todos los horarios existentes para este branch
            create: schedules.map((schedule: { day: string; startTime: string; endTime: string }) => ({
              day: schedule.day,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
            })),
          },
        },
        include: { schedules: true }, // Incluimos los horarios en la respuesta
      });

      return res.status(200).json(branch);
    } catch (error) {
      console.error("Error al actualizar la sucursal:", error);
      return res.status(500).json({ error: "Error al actualizar la sucursal" });
    }
  } else {
    res.setHeader("Allow", ["POST", "PUT"]);
    return res.status(405).end(`Método ${req.method} no permitido`);
  }
}
