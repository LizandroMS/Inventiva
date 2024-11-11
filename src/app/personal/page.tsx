"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
// Corrección en la importación de jwtDecode
import {jwtDecode} from "jwt-decode";
import Header from "@/components/Header_Interno";
import { io } from "socket.io-client";
import Footer from "@/components/Footer";

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
  paymentType: string;
  ruc?: string;
  companyName?: string;
  companyAddress?: string;
}

interface DecodedToken {
  role: string;
  branchId: number;
}

// Inicializar el socket
const socket = io({
  path: "/api/socket",
});

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
  console.log(branchId);

  useEffect(() => {
    isAudioAllowedRef.current = isAudioAllowed;
  }, [isAudioAllowed]);

  useEffect(() => {
    audioRef.current = new Audio("/audio/nuevo_pedido.mp3");
    audioRef.current.load();
  }, []);

  // Función para obtener los pedidos
  const fetchPedidos = async (branchIdToUse: number) => {
    try {
      const res = await fetch(
        `/api/personal/getOrders?branchId=${branchIdToUse}`
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

      // Llamar a fetchPedidos con decoded.branchId
      fetchPedidos(decoded.branchId);
      setTokenValid(true);

      socket.on("newOrder", (data) => {
        const Validation: string = data.CANCELACION;
        console.log("Validation ===> ", Validation);
        fetchPedidos(decoded.branchId);
        if (
          isAudioAllowedRef.current &&
          audioRef.current &&
          Validation !== "CANCELADO"
        ) {
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
          .filter(
            (pedido) =>
              pedido.status !== "ENTREGADO" && pedido.status !== "CANCELADO"
          );

        setPedidos(updatedPedidos);

        socket.emit("updateOrderStatus", { id, status: nuevoEstado });
      } else {
        console.error("Error al actualizar el estado del pedido");
      }
    } catch (error) {
      console.error("Error al cambiar el estado del pedido:", error);
    }
  };

  const handlePrintBoleta = (pedido: Pedido) => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Ticket  #${pedido.id}</title>
            <style>
              body { 
                font-family: 'Courier New', Courier, monospace; 
                padding: 10px; 
                width: 80mm; 
              }
              .center { 
                text-align: center; 
              }
              .right { 
                text-align: right; 
              }
              .left { 
                text-align: left; 
              }
              table { 
                width: 100%; 
              }
              th, td { 
                padding: 5px; 
                border-bottom: 1px solid black; 
              }
              .bold { 
                font-weight: bold; 
              }
              .total { 
                font-size: 1.2em; 
                font-weight: bold; 
              }
              .print-btn {
                display: inline-block;
                margin: 20px 0;
                padding: 10px 20px;
                background-color: #4CAF50;
                color: white;
                font-size: 16px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s ease;
              }
              .print-btn:hover {
                background-color: #45a049;
              }
            </style>
          </head>
          <body>
            <div class="center">
              <h2>Pollería El Sabrosito</h2>
              <p><strong>Ticket de Venta</strong></p>
              <p>Pedido #${pedido.id}</p>
            </div>
            <table>
              <tr>
                <td>Fecha:</td>
                <td class="right">${new Date(
                  pedido.createdAt
                ).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Cliente:</td>
                <td class="right">${pedido.User.fullName}</td>
              </tr>
              <tr>
                <td>Teléfono:</td>
                <td class="right">${pedido.User.phone}</td>
              </tr>
              <tr>
                <td>Dirección:</td>
                <td class="right">${
                  pedido.User.addresses.find((addr) => addr.isActive)
                    ?.address || "N/A"
                }</td>
              </tr>
              <tr>
                <td>Comprobante:</td>
                <td class="right">${pedido.paymentType}</td>
              </tr>
              ${
                pedido.paymentType === "Factura"
                  ? `
                <tr>
                  <td>RUC:</td>
                  <td class="right">${pedido.ruc || "N/A"}</td>
                </tr>
                <tr>
                  <td>Nombre Empresa:</td>
                  <td class="right">${pedido.companyName || "N/A"}</td>
                </tr>
                <tr>
                  <td>Dirección Empresa:</td>
                  <td class="right">${pedido.companyAddress || "N/A"}</td>
                </tr>
              `
                  : ""
              }
            </table>
  
            <h3>Productos</h3>
            <table>
              ${pedido.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.productName}</td>
                  <td class="right">${item.quantity} x S/ ${(
                    item.promotional_price || item.price
                  ).toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
            </table>
  
            <div class="right total">
              <p>Total: S/ ${pedido.totalAmount.toFixed(2)}</p>
            </div>
            <div class="center">
              <p>Gracias por su compra</p>
              <p>Pollería El Sabrosito</p>
            </div>
            <div class="center">
              <button class="print-btn" onclick="window.print();">Imprimir Ticket</button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
    }
  };


  const handleCancelarPedido = async (id: number) => {
    await cambiarEstadoPedido(id, "CANCELADO");
  };

  const getAvailableStates = (estadoActual: string) => {
    console.log("estado actual", estadoActual);
    switch (estadoActual) {
      case "PENDIENTE":
        return ["PENDIENTE", "PREPARANDO"];
      case "PREPARANDO":
        return ["PREPARANDO", "DRIVER"];
      case "DRIVER":
        return ["DRIVER", "ENTREGADO"];
      case "ENTREGADO":
      case "CANCELADO":
        return []; // No se puede cambiar el estado una vez que se ha entregado o cancelado
      default:
        return estadosPosibles;
    }
  };

  // Función para refrescar los pedidos
  const refrescarPedidos = async () => {
    if (branchId !== null) {
      await fetchPedidos(branchId);
    } else {
      console.error("Branch ID is not set.");
    }
  };

  if (!isAudioAllowed) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
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
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
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

        {/* Botón "Refrescar Pedidos" */}
        <div className="flex justify-center mb-4">
          <button
            onClick={refrescarPedidos}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
          >
            Refrescar Pedidos
          </button>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pedidos.map((pedido) => (
            <li
              key={pedido.id}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between border-l-4 border-yellow-500"
            >
              <div>
                {/* Información del pedido */}
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

                {/* Aquí va el resto del contenido del pedido */}
              </div>

              <button
                onClick={() => handlePrintBoleta(pedido)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg mt-4 transition-colors"
              >
                Imprimir Ticket
              </button>

              {/* Selector de estados */}
              <select
                value={pedido.status || ""}
                onChange={(e) =>
                  cambiarEstadoPedido(pedido.id, e.target.value)
                }
                className="mt-4 bg-gray-100 border border-gray-300 text-black py-2 px-4 rounded-lg"
              >
                {getAvailableStates(pedido.status)
                  .filter((estado) => estado !== undefined && estado !== null)
                  .map((estado) => (
                    <option key={estado} value={estado}>
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </option>
                  ))}
              </select>

              {/* Botón para cancelar */}
              {pedido.status === "PENDIENTE" && (
                <button
                  onClick={() => handleCancelarPedido(pedido.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg mt-4 transition-colors"
                >
                  Cancelar Pedido
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <Footer />
    </div>
  );
}
