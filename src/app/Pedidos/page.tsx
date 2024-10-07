"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { io } from "socket.io-client";
import { User } from "@prisma/client";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

// Inicializar el socket
const socket = io({
  path: "/api/socket",
});

interface PedidoItem {
  productId: number;
  quantity: number;
  price: number;
  Product: {
    name: string;
    description: string;
    imagenUrl: string;
    promotional_price: number | null; // Añadimos el campo de precio promocional
  };
  observation:string
}

interface Pedido {
  id: number;
  status: string;
  totalAmount: number;
  items: PedidoItem[];
  observation:string
}

interface DecodedToken {
  id: number;
  role: string;
  branchId: number;
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const { addToCart, cartItems } = useCart();
  const router = useRouter();
  console.log(addToCart);
  // Función para devolver etiquetas de estado según el estado del pedido
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return "PENDIENTE";
      case "PREPARANDO":
        return "PREPARANDO";
      case "DRIVER":
        return "DRIVER";
      case "ENTREGADO":
        return "ENTREGADO";
      case "CANCELADO":
        return "CANCELADO";
      default:
        return "Desconocido";
    }
  };

  // Función para asignar colores según el estado del pedido
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return "bg-yellow-500";
      case "PREPARANDO":
        return "bg-blue-500";
      case "DRIVER":
        return "bg-orange-500";
      case "ENTREGADO":
        return "bg-green-500";
      case "CANCELADO":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Función para obtener el índice del estado actual
  const getStatusIndex = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return 0;
      case "PREPARANDO":
        return 1;
      case "DRIVER":
        return 2;
      case "ENTREGADO":
        return 3;
      case "CANCELADO":
        return -1;
      default:
        return 0;
    }
  };

  // Barra de progreso visual del pedido
  const PedidoProgress = ({ status }: { status: string }) => {
    const steps = ["Pendiente", "Preparando", "En camino", "Entregado"];
    const currentStep = getStatusIndex(status);

    return (
      <div className="flex items-center space-x-4 my-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${
                index <= currentStep ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 w-8 ${
                  index < currentStep ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    const fetchPedidos = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        console.error("Usuario no autenticado");
        return;
      }

      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const res = await fetch(`/api/getOrders?id=${decoded.id}`);

        if (res.ok) {
          const data = await res.json();
          setPedidos(data);
        }
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
      }
    };

    fetchPedidos();

    // Cargar usuario autenticado
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error al parsear el usuario del localStorage:", error);
      }
    } else {
      router.push("/login");
    }

    // Escuchar eventos de actualización de estado de pedido
    socket.on("orderStatusUpdated", (data) => {
      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === data.id ? { ...pedido, status: data.status } : pedido
        )
      );
    });

    return () => {
      socket.off("orderStatusUpdated");
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
    setUser(null); // Limpiar el estado del usuario
    router.push("/");
    window.location.reload(); 
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header
        user={user}
        handleLogout={handleLogout}
        cartItems={cartItems}
      />

      <div className="container mx-auto py-8 px-4 md:px-0">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Tus Pedidos
        </h1>
        <div className="grid grid-cols-1 gap-6">
          {pedidos.length > 0 ? (
            pedidos.map((pedido) => (
              <div
                key={pedido.id}
                className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
              >
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">
                    Pedido #{pedido.id}
                  </h2>
                  <span
                    className={`px-4 py-2 mt-2 sm:mt-0 rounded-full text-white font-bold ${getStatusColor(
                      pedido.status
                    )}`}
                  >
                    {getStatusLabel(pedido.status)}
                  </span>
                </div>

                {pedido.status !== "CANCELADO" && (
                  <PedidoProgress status={pedido.status} />
                )}

                <p className="text-lg mb-2">
                  <strong>Total:</strong> S/ {pedido.totalAmount.toFixed(2)}
                </p>

                <ul className="divide-y divide-gray-200">
                  {pedido.items.map((item) => (
                    <li key={item.productId} className="py-4">
                      <div className="flex flex-col sm:flex-row justify-between">
                        <div className="flex items-center mb-4 sm:mb-0">
                          <div className="mr-4">
                            <Image
                              src={item.Product.imagenUrl}
                              alt={item.Product.name}
                              width={64}
                              height={64}
                              className="rounded-lg"
                            />
                          </div>

                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              {item.Product.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {item.Product.description}
                            </p>
                            <p className="text-sm text-gray-600">
                              Observacion: {item.observation}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-700">
                            {item.Product.promotional_price ? (
                              <>
                                <span className="text-green-600">
                                  S/ {item.Product.promotional_price.toFixed(2)}
                                </span>
                                <span className="line-through text-red-500 ml-2">
                                  S/ {item.price.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span>S/ {item.price.toFixed(2)}</span>
                            )}{" "}
                            x {item.quantity}
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            Subtotal: S/{" "}
                            {(
                              (item.Product.promotional_price || item.price) *
                              item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 text-right">
                  <p className="text-lg font-bold text-gray-800">
                    Total a pagar: S/ {pedido.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-700">
              Aún no tienes pedidos registrados.
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
