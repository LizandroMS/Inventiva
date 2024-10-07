"use client"; // Asegura que este componente se ejecute en el cliente

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Cambiamos de next/router a next/navigation
import { FaCheckCircle, FaUserCircle } from "react-icons/fa";

interface Address {
  id: number;
  address: string;
  referencia?: string;
  isActive: boolean;
}

interface UserProfile {
  id: number; // Asegúrate de que el ID del usuario esté presente
  fullName: string;
  email: string;
  phone: string;
  dni: string;
  birthDate: string;
  addresses: Address[];
}

export default function Perfil() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  // Cargar los datos del usuario al montar el componente
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        console.log(storedUser);
        if (storedUser) {
          setUser(JSON.parse(storedUser)); // Aquí simulo que obtienes los datos del usuario
        }
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
        setError("Error al cargar los datos.");
      }
    };

    fetchUser();
  }, []);

  // Función para seleccionar la dirección activa
  const handleSelectAddress = async (addressId: number) => {
    if (!user) return;

    try {
      const res = await fetch("/api/updateActiveAddress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id, // El ID del usuario
          addressId,
        }),
      });

      if (!res.ok) {
        throw new Error("Error al actualizar la dirección activa.");
      }

      // Actualizamos el estado del usuario localmente
      const updatedAddresses = user.addresses.map((addr) =>
        addr.id === addressId
          ? { ...addr, isActive: true }
          : { ...addr, isActive: false }
      );

      setUser({ ...user, addresses: updatedAddresses });
    } catch (error) {
      console.error("Error al actualizar la dirección activa:", error);
      setError("Ocurrió un error al actualizar la dirección activa.");
    }
  };

  if (!user) return <p className="text-center text-gray-500">Cargando...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-blue-900 to-black p-4 md:p-8">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-8">
          {/* Ícono de usuario */}
          <FaUserCircle className="text-7xl md:text-8xl text-yellow-400 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2">
            {user.fullName}
          </h1>
          <p className="text-lg md:text-xl text-yellow-100">
            Gestiona tu perfil y direcciones
          </p>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Información estática del usuario */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-8 max-w-3xl mx-auto text-white">
          <h2 className="text-3xl font-semibold mb-4">Información Personal</h2>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            <p className="text-lg font-medium">📧 Email: {user.email}</p>
            <p className="text-lg font-medium">📞 Teléfono: {user.phone}</p>
            <p className="text-lg font-medium">🆔 DNI: {user.dni}</p>
            <p className="text-lg font-medium">
              🎂 Fecha de Nacimiento:{" "}
              {new Date(user.birthDate).toLocaleDateString("es-ES")}
            </p>
          </div>
        </div>

        {/* Direcciones del usuario */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 max-w-3xl mx-auto text-white">
          <h2 className="text-3xl font-semibold mb-4">Direcciones</h2>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {user.addresses.map((address) => (
              <div
                key={address.id}
                className={`p-6 border rounded-lg transition-all duration-300 ${
                  address.isActive
                    ? "border-yellow-400 bg-gray-700 shadow-lg"
                    : "border-gray-500 bg-gray-900 hover:bg-gray-800"
                }`}
              >
                <p className="text-lg font-semibold">📍 {address.address}</p>
                {address.referencia && (
                  <p className="text-gray-300 mt-2">
                    📝 Referencia: {address.referencia}
                  </p>
                )}
                <button
                  className={`mt-4 w-full py-2 rounded-lg font-bold transition-colors ${
                    address.isActive
                      ? "bg-yellow-400 text-black cursor-default"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  onClick={() => handleSelectAddress(address.id)}
                  disabled={address.isActive}
                >
                  {address.isActive ? (
                    <span className="flex justify-center items-center space-x-2">
                      <FaCheckCircle className="text-xl" />
                      <span>Dirección Activa</span>
                    </span>
                  ) : (
                    "Seleccionar como activa"
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
