// src/pages/api/socket.js
import { Server } from "socket.io";

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket already initialized");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    // Emitimos actualizaciones de estado a los clientes
    socket.on("updateOrderStatus", (data) => {
      io.emit("orderStatusUpdated", data); // Enviamos la actualización a todos los clientes
    });
  });

  res.end();
}
