// src/pages/pedidos.tsx
"use client"; 
import { useState, useEffect } from "react";
interface PedidoItem {
    productId: number;
    productName: string;
    quantity: number;
  }
interface Pedido {
    id: number;
    status: string;
    totalAmount: number;
    items: PedidoItem[];
  }
export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]); // Cambiar por el tipo correcto

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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Tus Pedidos</h1>
      <div className="grid grid-cols-1 gap-6">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Pedido #{pedido.id}</h2>
            <p><strong>Estado:</strong> {pedido.status}</p>
            <p><strong>Total:</strong> S/ {pedido.totalAmount.toFixed(2)}</p>
            <ul>
              {pedido.items.map((item) => (
                <li key={item.productId}>{item.productName} - {item.quantity}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
