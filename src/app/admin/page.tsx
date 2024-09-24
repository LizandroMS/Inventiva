"use client";

import { useState, useEffect } from 'react';

interface Personal {
  id: number;
  nombre: string;
  rol: string;
}

export default function AdminPage() {
  const [personal, setPersonal] = useState<Personal[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulamos la carga de usuarios del personal (puedes hacerlo con fetch a tu API)
  useEffect(() => {
    const cargarPersonal = async () => {
      const data = [
        { id: 1, nombre: 'Juan Pérez', rol: 'Personal' },
        { id: 2, nombre: 'María Gómez', rol: 'Personal' },
      ];
      setPersonal(data);
      setLoading(false);
    };

    cargarPersonal();
  }, []);

  if (loading) {
    return <p>Cargando personal...</p>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestión de Personal</h1>
      <ul>
        {personal.map((persona) => (
          <li key={persona.id} className="mb-4 border p-4 rounded-lg shadow-lg">
            <p>Nombre: {persona.nombre}</p>
            <p>Rol: {persona.rol}</p>
            <button className="mt-2 bg-red-500 text-white py-1 px-4 rounded">
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      
      <h2 className="text-xl font-bold mb-4 mt-6">Agregar nuevo personal</h2>
      {/* Formulario para agregar nuevo personal */}
      <form>
        <input type="text" placeholder="Nombre completo" className="border p-2 rounded mb-4 w-full" />
        <select className="border p-2 rounded mb-4 w-full">
          <option value="personal">Personal</option>
          <option value="admin">Administrador</option>
        </select>
        <button className="bg-green-500 text-white py-2 px-4 rounded">
          Agregar Personal
        </button>
      </form>
    </div>
  );
}
