"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';

interface Pedido {
  id: number;
  producto: string;
  cantidad: number;
  estado: string;
}

export default function PersonalPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Simulación de la carga de datos iniciales (esto puede venir de tu API)
  useEffect(() => {
    // Obtener el token desde localStorage o cookies
    const token = localStorage.getItem('userToken'); // O ajustar para usar cookies
    console.log("token",token)
    if (!token) {
      // Si no hay token, redirigir al login
      router.push('/login');
      return;
    }

    try {
      const decoded = jwt.verify(token, 'secret-key') as { role: string };

      if (decoded.role !== 'personal') {
        // Si el rol no es 'personal', redirigir a la página de "No autorizado"
        router.push('/unauthorized');
        return;
      }

      // Si el token y el rol son válidos, cargar los pedidos iniciales
      const pedidosIniciales = [
        { id: 1, producto: 'Pollo a la brasa', cantidad: 2, estado: 'Pendiente' },
        { id: 2, producto: 'Salchipapas', cantidad: 1, estado: 'En preparación' },
      ];

      setPedidos(pedidosIniciales);
    } catch (error) {
      // Si el token es inválido o expiró, redirigir al login
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const cambiarEstadoPedido = (id: number) => {
    const nuevosPedidos = pedidos.map((pedido) => {
      if (pedido.id === id) {
        return { ...pedido, estado: 'Completado' };
      }
      return pedido;
    });
    setPedidos(nuevosPedidos);
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Bandeja de Pedidos</h1>
      <ul>
        {pedidos.map((pedido) => (
          <li key={pedido.id} className="mb-4 border p-4 rounded-lg shadow-lg">
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
  );
}
