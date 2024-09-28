"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // Usa jwt-decode para decodificar el token
import Header from "@/components/Header";
import {
  FaUserPlus,
  FaBoxes,
  FaHistory,
  FaClipboardList,
} from "react-icons/fa"; // Íconos

interface DecodedToken {
  role: string;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Para redirigir en el cliente

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.role !== "admin") {
        router.push("/unauthorized");
        return;
      }
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto py-10 px-4 md:px-8 lg:px-16">
        <h1 className="text-3xl font-bold mb-8 text-center text-white-800">
          Panel de Administración
        </h1>

        {/* Grid para las tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Card: Registro de Personal */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-center mb-4 text-yellow-500">
              <FaUserPlus size={50} />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-700 text-center">
              Registro de Personal
            </h2>
            <p className="text-gray-600 text-center">
              Agrega, edita o elimina personal de tu establecimiento. Administra
              sus roles de acceso.
            </p>
            <button
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              onClick={() => router.push("/admin/RegistroPersonal")}
            >
              Gestionar Personal
            </button>
          </div>

          {/* Card: Registro de Productos */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-center mb-4 text-green-500">
              <FaBoxes size={50} />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-700 text-center">
              Registro de Productos
            </h2>
            <p className="text-gray-600 text-center">
              Registra los nuevos platos y productos disponibles para la venta.
              Mantén tu inventario actualizado.
            </p>
            <button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
              Gestionar Productos
            </button>
          </div>

          {/* Card: Historial de Actividades */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-center mb-4 text-purple-500">
              <FaHistory size={50} />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-700 text-center">
              Historial de Actividades
            </h2>
            <p className="text-gray-600 text-center">
              Revisa el historial de operaciones realizadas en el sistema,
              incluyendo ventas y modificaciones.
            </p>
            <button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
              Ver Historial
            </button>
          </div>

          {/* Card: Pedidos en Cola */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-center mb-4 text-red-500">
              <FaClipboardList size={50} />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-700 text-center">
              Pedidos en Cola
            </h2>
            <p className="text-gray-600 text-center">
              Administra y revisa los pedidos en cola para ser preparados y
              entregados.
            </p>
            <button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
              Ver Pedidos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
