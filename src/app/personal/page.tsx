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
    const token = localStorage.getItem("userToken"); // Obtener el token de localStorage
    console.log("Token obtenido de localStorage:", token);

    if (!token) {
      // Si no hay token, redirigir al login
      router.push("/login");
      return;
    }

    try {
      // Decodificar el token en el frontend
      const decoded = jwtDecode<DecodedToken>(token);
      console.log("Token decodificado:", decoded);

      if (decoded.role !== "personal") {
        // Si el rol no es 'personal', redirigir a "No autorizado"
        router.push("/unauthorized");
        return;
      }

      // Si el token y el rol son válidos, cargar los pedidos iniciales simulados
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
      setTokenValid(true); // El token es válido y el rol es "personal"
    } catch (error) {
      // Si el token es inválido o hay algún otro error
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
    return <p>No tienes permisos para acceder a esta página.</p>; // Si el token no es válido
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Bandeja de Pedidos</h1>
        <ul>
          {pedidos.map((pedido) => (
            <li
              key={pedido.id}
              className="mb-4 border p-4 rounded-lg shadow-lg"
            >
              <p>Producto: {pedido.producto}</p>
              <p>Cantidad: {pedido.cantidad}</p>
              <p>Estado: {pedido.estado}</p>
              <button
                onClick={() => cambiarEstadoPedido(pedido.id)}
                className="mt-2 bg-blue-500 text-white py-1 px-4 rounded"
              >
                Cambiar estado
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
