"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Header from "@/components/Header_Interno";

interface Pedido {
  id: number;
  producto: string;
  cantidad: number;
  estado: string;
}

interface DecodedToken {
  role: string;
}

export default function PersonalPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [tokenValid, setTokenValid] = useState(false);

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

      const pedidosIniciales = [
        {
          id: 1,
          producto: "Pollo a la brasa",
          cantidad: 2,
          estado: "Pendiente",
        },
        {
          id: 2,
          producto: "Salchipapas",
          cantidad: 1,
          estado: "En preparación",
        },
      ];

      setPedidos(pedidosIniciales);
      setTokenValid(true);
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const cambiarEstadoPedido = (id: number) => {
    const nuevosPedidos = pedidos.map((pedido) => {
      if (pedido.id === id) {
        return { ...pedido, estado: "Completado" };
      }
      return pedido;
    });
    setPedidos(nuevosPedidos);
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!tokenValid) {
    return <p>No tienes permisos para acceder a esta página.</p>;
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
              className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between"
            >
              <div>
                <p className="font-semibold text-gray-700">Producto: {pedido.producto}</p>
                <p className="text-gray-600">Cantidad: {pedido.cantidad}</p>
                <p className="text-gray-600">Estado: {pedido.estado}</p>
              </div>
              <button
                onClick={() => cambiarEstadoPedido(pedido.id)}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Cambiar estado
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <footer className="bg-green-700 text-white py-4 text-center mt-auto">
        <p>© 2024 Pollería El Sabrosito. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
