"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";

interface PedidoItem {
  productId: number;
  quantity: number;
  price: number;
  Product: {
    name: string;
    description: string;
    imagenUrl: string;
  };
}

interface Pedido {
  id: number;
  status: string;
  totalAmount: number;
  items: PedidoItem[];
}
interface DecodedToken {
  id: number;
  role: string;
  branchId: number;
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  // Función para devolver etiquetas de estado según el estado del pedido
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "preparing":
        return "Preparando";
      case "delivering":
        return "En camino";
      case "delivered":
        return "Entregado";
      case "cancelled":
        return "Cancelado";
      default:
        return "Desconocido";
    }
  };
  // Función para asignar colores según el estado del pedido
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"; // Pendiente
      case "preparing":
        return "bg-blue-500"; // Preparando
      case "delivering":
        return "bg-orange-500"; // En camino
      case "delivered":
        return "bg-green-500"; // Entregado
      case "cancelled":
        return "bg-red-500"; // Cancelado
      default:
        return "bg-gray-500"; // Desconocido
    }
  };

  useEffect(() => {
    const fetchPedidos = async () => {
      const token = localStorage.getItem("userToken"); // Obtener el token del local storage
      if (!token) {
        console.error("Usuario no autenticado");
        return;
      }
      console.log("token", token);
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        console.log("decoded -- ", decoded);
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
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Tus Pedidos</h1>
      <div className="grid grid-cols-1 gap-6">
        {pedidos.length > 0 ? (
          pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Pedido #{pedido.id}</h2>
                <span
                  className={`px-4 py-2 rounded-full text-white font-bold ${getStatusColor(
                    pedido.status
                  )}`}
                >
                  {getStatusLabel(pedido.status)}
                </span>
              </div>

              <p className="text-lg mb-2">
                <strong>Total:</strong> S/ {pedido.totalAmount.toFixed(2)}
              </p>

              <ul className="divide-y divide-gray-200">
                {pedido.items.map((item) => (
                  <li key={item.productId} className="py-4">
                    <div className="flex justify-between">
                      <div className="flex items-center">
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
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-700">
                          S/ {item.price.toFixed(2)} x {item.quantity}
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          Subtotal: S/ {(item.price * item.quantity).toFixed(2)}
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
  );
}
