"use client";

import { useEffect, useState } from 'react';

interface Pedido {
  id: number;
  producto: string;
  cantidad: number;
  estado: string;
}

export default function PersonalPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulamos la carga de pedidos (puedes hacerlo con fetch a tu API)
  useEffect(() => {
    const cargarPedidos = async () => {
      // Simulación de fetch de datos de pedidos
      const data = [
        { id: 1, producto: 'Pollo a la brasa', cantidad: 2, estado: 'Pendiente' },
        { id: 2, producto: 'Salchipapas', cantidad: 1, estado: 'En preparación' },
      ];
      setPedidos(data);
      setLoading(false);
    };
    
    cargarPedidos();
  }, []);

  if (loading) {
    return <p>Cargando pedidos...</p>;
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
            <button className="mt-2 bg-blue-500 text-white py-1 px-4 rounded">
              Cambiar estado
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
