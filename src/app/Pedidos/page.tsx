"use client";
import { useState, useEffect } from "react";
import Image from "next/image"; // Importamos el componente Image de Next.js

// Interfaces para los pedidos y productos
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

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await fetch("/api/getOrders");
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
      default:
        return "Desconocido";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "preparing":
        return "bg-blue-500";
      case "delivering":
        return "bg-orange-500";
      case "delivered":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

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
                <h2 className="text-2xl font-semibold">
                  Pedido #{pedido.id}
                </h2>
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
                        {/* Imagen del producto utilizando next/image */}
                        <div className="mr-4">
                          <Image
                            src={item.Product.imagenUrl}
                            alt={item.Product.name}
                            width={64}
                            height={64} // Tamaño fijo para mejorar el rendimiento
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
                          Subtotal: S/{" "}
                          {(item.price * item.quantity).toFixed(2)}
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
