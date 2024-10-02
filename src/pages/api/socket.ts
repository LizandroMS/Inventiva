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
    
    // Inicializar el servidor de Socket.IO
    const io = new IOServer(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: "*", // Asegúrate de configurar correctamente el CORS si es necesario
        methods: ["GET", "POST"],
      },
    });

    // Guardar la instancia de Socket.IO en el servidor para evitar inicializarlo de nuevo
    res.socket.server.io = io;

    // Manejar la conexión de clientes
    io.on("connection", (socket) => {
      console.log("Cliente conectado:", socket.id);

      socket.on("updateOrderStatus", (data) => {
        console.log("Estado de pedido actualizado:", data);
        io.emit("orderStatusUpdated", data); // Emitir evento a todos los clientes conectados
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
