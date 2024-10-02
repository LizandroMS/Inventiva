import { Server as NetServer } from "http";
import { Server as IOServer } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: IOServer;
    };
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    console.log("Iniciando el servidor Socket.IO...");
    
    const io = new IOServer(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: "*", // Configura el CORS según tus necesidades
        methods: ["GET", "POST"],
      },
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("Cliente conectado:", socket.id);

      socket.on("newOrder", (data) => {
        console.log("Nuevo pedido recibido:", data);
        io.emit("newOrder", data);
      });

      socket.on("updateOrderStatus", (data) => {
        console.log("Estado de pedido actualizado:", data);
        io.emit("orderStatusUpdated", data);
      });

      socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
      });
    });
  } else {
    console.log("Servidor Socket.IO ya está en ejecución.");
  }

  res.end();
}
