"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // Decodificador de JWT
import Header from "@/components/Header_Interno"; // Asegúrate de tener este componente

interface Pedido {
  id: number;
  producto: string;
  cantidad: number;
  estado: string;
  branchId: number;
}

interface DecodedToken {
  role: string;
  branchId: number; // Añadimos branchId al token decodificado
}

export default function PersonalPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [tokenValid, setTokenValid] = useState(false);
  const [branchId, setBranchId] = useState<number | null>(null); // Guardar el branchId del personal
  console.log(branchId);
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      console.log("decoded", decoded);
      if (decoded.role !== "personal") {
        router.push("/unauthorized");
        return;
      }

      // Guardar el branchId en el estado
      setBranchId(decoded.branchId);

      // Cargar los pedidos correspondientes a la sucursal del personal
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
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      router.push("/login");
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
                <p className="font-semibold text-gray-700">
                  Producto: {pedido.producto}
                </p>
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
