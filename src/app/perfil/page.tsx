"use client"; // Asegura que este componente se ejecute en el cliente

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaUserCircle, FaPlusCircle } from "react-icons/fa";

interface Address {
  id: number;
  address: string;
  referencia?: string;
  isActive: boolean;
}

interface UserProfile {
  id: number;
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
  const [newAddress, setNewAddress] = useState("");
  const [newReferencia, setNewReferencia] = useState("");
  const router = useRouter();
  console.log(router);
  // Cargar los datos del usuario al montar el componente
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
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
      const res = await fetch("/api/usuario/updateActiveAddress", {
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

  // Función para agregar una nueva dirección
  const handleAddAddress = async () => {
    if (!newAddress || !user) {
      setError("La dirección no puede estar vacía");
      return;
    }

    try {
      const res = await fetch("/api/usuario/addAddress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          address: newAddress,
          referencia: newReferencia,
        }),
      });

      if (!res.ok) {
        throw new Error("Error al agregar la nueva dirección.");
      }

      const addedAddress = await res.json();
      setUser({ ...user, addresses: [...user.addresses, addedAddress] });
      setNewAddress("");
      setNewReferencia("");
    } catch (error) {
      console.error("Error al agregar la nueva dirección:", error);
      setError("Ocurrió un error al agregar la nueva dirección.");
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

        {/* Formulario para agregar nueva dirección */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-8 max-w-3xl mx-auto text-white">
          <h2 className="text-3xl font-semibold mb-4">
            Añadir Nueva Dirección
          </h2>
          <div className="grid gap-4 sm:grid-cols-1">
            <input
              type="text"
              placeholder="Dirección"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="w-full p-2 rounded-lg border-2 border-gray-500 bg-gray-700 text-white"
            />
            <input
              type="text"
              placeholder="Referencia (Opcional)"
              value={newReferencia}
              onChange={(e) => setNewReferencia(e.target.value)}
              className="w-full p-2 rounded-lg border-2 border-gray-500 bg-gray-700 text-white"
            />
            <button
              onClick={handleAddAddress}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              <FaPlusCircle className="inline mr-2" />
              Agregar Dirección
            </button>
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
