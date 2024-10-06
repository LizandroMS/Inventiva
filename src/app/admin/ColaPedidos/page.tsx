"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Header from "@/components/Header_Interno";
import Footer from "@/components/Footer";

interface PedidoItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  Product: {
    id: number;
    name: string;
    description: string;
    price: number;
    promotional_price: number | null;
    stock: number;
    status: string;
    imagenUrl: string;
  };
  observation: string;
}

interface Pedido {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: PedidoItem[];
  User: {
    fullName: string;
    address: string;
    phone: string;
    Referencia: string;
  };
}

interface Branch {
  id: number;
  name: string;
}

interface DecodedToken {
  role: string;
}

export default function ColaPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [tokenValid, setTokenValid] = useState(false);

  // Función para cargar las sucursales
  const fetchBranches = async () => {
    try {
      const res = await fetch("/api/getBranches");
      if (res.ok) {
        const data: Branch[] = await res.json();
        setBranches(data);
        if (data.length > 0) {
          setSelectedBranch(data[0].id);
        }
      }
    } catch (error) {
      console.error("Error al cargar las sucursales:", error);
    }
  };

  // Función para cargar pedidos de la sucursal seleccionada
  const fetchPedidos = async () => {
    if (selectedBranch === null) return;

    try {
      const res = await fetch(`/api/personal/getOrders?branchId=${selectedBranch}`);
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

      setTokenValid(true);
      fetchBranches(); // Cargar sucursales al inicio
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (selectedBranch !== null) {
      fetchPedidos(); // Cargar pedidos cuando se selecciona una sucursal
    }
  }, [selectedBranch]);

  if (loading) {
    return <p className="text-center text-gray-600">Cargando...</p>;
  }

  if (!tokenValid) {
    return (
      <p className="text-center text-red-500">
        No tienes permisos para acceder a esta página.
      </p>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Cola de Pedidos por Sucursal
        </h1>

        {/* Selector de sucursales y botón de actualizar */}
        <div className="flex items-center space-x-4 justify-center mb-6">
          <div>
            <label className="text-gray-700 font-semibold mr-4">Selecciona una sucursal:</label>
            <select
              value={selectedBranch ?? ""}
              onChange={(e) => setSelectedBranch(Number(e.target.value))}
              className="p-3 border rounded-lg focus:outline-none focus:border-yellow-500 text-gray-700"
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchPedidos}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
          >
            Actualizar
          </button>
        </div>

        {pedidos.length === 0 ? (
          <p className="text-center text-gray-600">No hay pedidos en esta sucursal.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pedidos.map((pedido) => (
              <li
                key={pedido.id}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between border-l-4 border-yellow-500"
              >
                <div>
                  <h2 className="font-bold text-lg text-yellow-600">
                    Pedido #{pedido.id}
                  </h2>
                  <p className="text-gray-600">
                    Fecha: {new Date(pedido.createdAt).toLocaleString()}
                  </p>
                  <p className="text-gray-600 font-semibold">
                    Estado: <span className="text-yellow-500">{pedido.status}</span>
                  </p>

                  {/* Mostrar datos del usuario */}
                  <div className="mt-4 bg-yellow-100 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800">Datos del Cliente</h3>
                    <p className="text-gray-600">
                      Nombres: <span className="font-bold">{pedido.User.fullName}</span>
                    </p>
                    <p className="text-gray-600">
                      Dirección: <span className="font-bold">{pedido.User.address}</span>
                    </p>
                    <p className="text-gray-600">
                      Referencia: <span className="font-bold">{pedido.User.Referencia}</span>
                    </p>
                    <p className="text-gray-600">
                      Número: <span className="font-bold">{pedido.User.phone}</span>
                    </p>
                  </div>

                  <h3 className="font-bold text-gray-800 mt-4 mb-2">
                    Productos ({pedido.items.length})
                  </h3>
                  <ul className="space-y-2">
                    {pedido.items.map((item) => (
                      <li key={item.id} className="flex flex-col bg-gray-50 p-2 rounded-lg shadow-sm">
                        <p className="font-semibold text-gray-700">{item.Product.name}</p>
                        <p className="text-gray-600 text-sm">{item.Product.description}</p>
                        <p className="text-gray-600 text-sm">Observación: {item.observation}</p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-gray-600">Cantidad: {item.quantity}</p>
                          <p className="text-gray-600">Precio: S/ {item.price.toFixed(2)}</p>
                        </div>
                        <p className="text-gray-600 text-sm">
                          Subtotal: S/ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </li>
                    ))}
                  </ul>

                  <p className="text-lg font-bold text-gray-800 mt-4">
                    Total: S/ {pedido.totalAmount.toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Footer/>
    </div>
  );
}
