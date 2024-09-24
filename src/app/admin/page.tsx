"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';

interface Personal {
  id: number;
  nombre: string;
  rol: string;
}

export default function AdminPage() {
  const [personal, setPersonal] = useState<Personal[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Para redirigir en el cliente

  useEffect(() => {
    // Simulación de obtener el token desde las cookies o localStorage
    const token = localStorage.getItem('userToken'); // O reemplazar con tu lógica de obtener cookies

    if (!token) {
      // Si no hay token, redirigir al login
      router.push('/login');
      return;
    }

    try {
      // Verificar el token y su rol
      const decoded = jwt.verify(token, 'secret-key') as { role: string };

      if (decoded.role !== 'admin') {
        // Si el rol no es 'admin', redirigir a "No Autorizado"
        router.push('/unauthorized');
        return;
      }

      // Simulación de la carga de datos del personal
      const personalInicial = [
        { id: 1, nombre: 'Juan Pérez', rol: 'Personal' },
        { id: 2, nombre: 'María Gómez', rol: 'Administrador' },
      ];

      setPersonal(personalInicial);
    } catch (error) {
      // Si hay un error con el token (expirado, inválido), redirigir al login
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <p>Cargando...</p>; // Mostrar indicador de carga mientras se verifica el token
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestión de Personal y Administradores</h1>

      <ul>
        {personal.map((persona) => (
          <li key={persona.id} className="mb-4 border p-4 rounded-lg shadow-lg">
            <p>Nombre: {persona.nombre}</p>
            <p>Rol: {persona.rol}</p>
            <button className="mt-2 bg-red-500 text-white py-1 px-4 rounded">Eliminar</button>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mb-4 mt-6">Agregar nuevo personal o administrador</h2>

      <form>
        <input type="text" placeholder="Nombre completo" className="border p-2 rounded mb-4 w-full" />
        <select className="border p-2 rounded mb-4 w-full">
          <option value="personal">Personal</option>
          <option value="admin">Administrador</option>
        </select>
        <button className="bg-green-500 text-white py-2 px-4 rounded">Agregar Personal/Administrador</button>
      </form>
    </div>
  );
}
