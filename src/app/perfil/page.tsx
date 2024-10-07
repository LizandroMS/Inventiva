"use client"; // Asegura que este componente se ejecute en el cliente

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Cambiamos de next/router a next/navigation
import { FaCheckCircle } from "react-icons/fa";

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
  const [error, setError] = useState('');
  const router = useRouter();

  // Cargar los datos del usuario al montar el componente
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        console.log(storedUser)
        if (storedUser) {
          setUser(JSON.parse(storedUser)); // Aquí simulo que obtienes los datos del usuario
        }
      } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
        setError('Error al cargar los datos.');
      }
    };

    fetchUser();
  }, []);

  // Función para seleccionar la dirección activa
  const handleSelectAddress = async (addressId: number) => {
    if (!user) return;

    try {
      const res = await fetch('/api/updateActiveAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id, // El ID del usuario
          addressId,
        }),
      });

      if (!res.ok) {
        throw new Error('Error al actualizar la dirección activa.');
      }

      // Actualizamos el estado del usuario localmente
      const updatedAddresses = user.addresses.map((addr) =>
        addr.id === addressId ? { ...addr, isActive: true } : { ...addr, isActive: false }
      );

      setUser({ ...user, addresses: updatedAddresses });
    } catch (error) {
      console.error('Error al actualizar la dirección activa:', error);
      setError('Ocurrió un error al actualizar la dirección activa.');
    }
  };

  if (!user) return <p>Cargando...</p>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Perfil del Usuario</h1>

      {error && <p className="text-red-500">{error}</p>}

      {/* Información estática del usuario */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">{user.fullName}</h2>
        <p>Email: {user.email}</p>
        <p>Teléfono: {user.phone}</p>
        <p>DNI: {user.dni}</p>
        <p>Fecha de Nacimiento: {new Date(user.birthDate).toLocaleDateString()}</p>
      </div>

      {/* Direcciones del usuario */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Direcciones</h2>
        {user.addresses.map((address) => (
          <div
            key={address.id}
            className={`p-4 border rounded-lg mb-4 ${
              address.isActive ? 'border-green-500' : 'border-gray-300'
            }`}
          >
            <p>{address.address}</p>
            {address.referencia && <p>Referencia: {address.referencia}</p>}
            <button
              className={`mt-2 p-2 rounded-lg ${
                address.isActive
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => handleSelectAddress(address.id)}
              disabled={address.isActive}
            >
              {address.isActive ? (
                <span className="flex items-center space-x-2">
                  <FaCheckCircle />
                  <span>Activa</span>
                </span>
              ) : (
                'Seleccionar como activa'
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
