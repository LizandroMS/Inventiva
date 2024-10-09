"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";
import Header from "@/components/Header_Interno";
import { io } from "socket.io-client";

// Inicializar el socket
const socket = io({
  path: "/api/socket",
});

interface Address {
  id: number;
  address: string;
  referencia: string | null;
  isActive: boolean;
}

interface PedidoItem {
  id: number;
  productId: number | null;
  quantity: number;
  price: number;
  productName: string;
  observation: string;
  imagenUrl: string;
  description: string;
  promotional_price: number | null;
  totalPrice: number;
  Product: {
    id: number;
    name: string;
    description: string;
    price: number;
    promotional_price: number | null;
    imagenUrl: string;
  } | null;
}

interface Pedido {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: PedidoItem[];
  User: {
    fullName: string;
    phone: string;
    addresses: Address[];
  };
}

interface DecodedToken {
  role: string;
  branchId: number;
}

export default function PersonalPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [tokenValid, setTokenValid] = useState(false);
  const [branchId, setBranchId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioAllowed, setIsAudioAllowed] = useState(false);
  const isAudioAllowedRef = useRef(isAudioAllowed);
  const estadosPosibles = ["PENDIENTE", "PREPARANDO", "DRIVER", "ENTREGADO"];
  console.log(branchId)
  useEffect(() => {
    isAudioAllowedRef.current = isAudioAllowed;
  }, [isAudioAllowed]);

  useEffect(() => {
    audioRef.current = new Audio("/audio/nuevo_pedido.mp3");
    audioRef.current.load();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      if (decoded.role !== "personal") {
        router.push("/unauthorized");
        return;
      }

      setBranchId(decoded.branchId);

      const fetchPedidos = async () => {
        try {
          const res = await fetch(
            `/api/personal/getOrders?branchId=${decoded.branchId}`
          );
          if (res.ok) {
            const data = await res.json();
            setPedidos(data);
          } else {
            console.error("Error al obtener pedidos");
          }
        } catch (error) {
          console.error("Error al obtener pedidos:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPedidos();
      setTokenValid(true);

      // Escuchar eventos de nuevos pedidos a través del socket
      socket.on("newOrder", () => {
        console.log("Nuevo pedido recibido a través del socket");
        fetchPedidos();
        if (isAudioAllowedRef.current && audioRef.current) {
          audioRef.current.play().catch((error) => {
            console.error("Error al reproducir el audio:", error);
          });
        }
      });

      return () => {
        socket.off("newOrder");
      };
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      router.push("/login");
    }
  }, [router]);

  const cambiarEstadoPedido = async (id: number, nuevoEstado: string) => {
    try {
      const res = await fetch(`/api/personal/updateOrderStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, nuevoEstado }),
      });

      if (res.ok) {
        const updatedPedidos = pedidos
          .map((pedido) => {
            if (pedido.id === id) {
              return { ...pedido, status: nuevoEstado };
            }
            return pedido;
          })
          .filter((pedido) => pedido.status !== "ENTREGADO");

        setPedidos(updatedPedidos);

        // Emitir actualización de estado a los comensales
        socket.emit("updateOrderStatus", { id, status: nuevoEstado });
      } else {
        console.error("Error al actualizar el estado del pedido");
      }
    } catch (error) {
      console.error("Error al cambiar el estado del pedido:", error);
    }
  };

  if (!isAudioAllowed) {
    return (
      <div className="flex items-center justify-center h-screen">
        <button
          onClick={() => {
            setIsAudioAllowed(true);
            if (audioRef.current) {
              audioRef.current
                .play()
                .then(() => {
                  audioRef.current?.pause();
                })
                .catch((error) => {
                  console.error("Error al reproducir el audio:", error);
                });
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
        >
          Habilitar Sonido
        </button>
      </div>
    );
  }

  if (loading) {
    return <p className="text-center text-gray-600">Cargando...</p>;
  }

  if (!tokenValid) {
    return (
      <p className="text-center text-red-500">
        No tienes permisos para acceder a esta página.
      </p>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Bandeja de Pedidos
        </h1>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pedidos.map((pedido) => (
            <li
              key={pedido.id}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between border-l-4 border-yellow-500"
            >
              <div>
                <h2 className="font-bold text-lg text-yellow-600">
                  Pedido #{pedido.id}
                </h2>
                <p className="text-gray-600">
                  Fecha: {new Date(pedido.createdAt).toLocaleString()}
                </p>
                <p className="text-gray-600 font-semibold">
                  Estado:{" "}
                  <span className="text-yellow-500">{pedido.status}</span>
                </p>

                <div className="mt-4 p-4 rounded-lg bg-gray-50">
                  <h3 className="font-semibold text-gray-800">
                    Datos del Cliente
                  </h3>
                  <p className="text-gray-600">
                    Nombres:{" "}
                    <span className="font-bold">{pedido.User.fullName}</span>
                  </p>
                  <p className="text-gray-600">
                    Número:{" "}
                    <span className="font-bold">{pedido.User.phone}</span>
                  </p>
                  <p className="font-semibold mt-2 text-black">Direcciones:</p>
                  <ul className="mt-2">
                    {pedido.User.addresses.map((address) => (
                      <li
                        key={address.id}
                        className={`p-2 mb-2 rounded-lg transition-all duration-300 text-black ${
                          address.isActive
                            ? "bg-yellow-200 border-yellow-500"
                            : "bg-gray-200"
                        }`}
                      >
                        <p>
                          📍 {address.address}{" "}
                          {address.isActive && (
                            <span className="text-green-600">[Activa]</span>
                          )}
                        </p>
                        {address.referencia && (
                          <p className="text-gray-500 text-sm">
                            Referencia: {address.referencia}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <h3 className="font-bold text-gray-800 mt-4 mb-2">
                  Productos ({pedido.items.length})
                </h3>
                <ul className="space-y-2">
                  {pedido.items.map((item) => {
                    const precioFinal =
                      item.promotional_price ?? item.price;

                    return (
                      <li
                        key={item.id}
                        className="flex flex-col bg-gray-50 p-2 rounded-lg shadow-sm"
                      >
                        <p className="font-semibold text-gray-700">
                          {item.productName}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {item.description}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Observación: {item.observation}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-gray-600">
                            Cantidad: {item.quantity}
                          </p>
                          <p className="text-gray-600">
                            Precio: S/ {precioFinal.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-gray-600 text-sm">
                          Subtotal: S/{" "}
                          {(precioFinal * item.quantity).toFixed(2)}
                        </p>
                      </li>
                    );
                  })}
                </ul>

                <p className="text-lg font-bold text-gray-800 mt-4">
                  Total: S/ {pedido.totalAmount.toFixed(2)}
                </p>
              </div>

              <select
                value={pedido.status}
                onChange={(e) => cambiarEstadoPedido(pedido.id, e.target.value)}
                className="mt-4 bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg"
              >
                {estadosPosibles.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      </div>

      <footer className="bg-green-700 text-white py-4 text-center mt-auto">
        <p>© 2024 Pollería El Sabrosito. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
