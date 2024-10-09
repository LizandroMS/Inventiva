"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import Header from "@/components/Header_Interno";
import Footer from "@/components/Footer";

// Definir las familias y los estados posibles
const familias = [
  "Pollos a la brasa",
  "Chifa",
  "Platos a la carta",
  "Parrillas",
  "Guarniciones",
  "Bebidas sin alcohol",
  "Bebidas con alcohol",
].map((familia) => familia.toUpperCase());

const estados = ["PENDIENTE", "PREPARANDO", "DRIVER", "ENTREGADO", "CANCELADO"];

interface Pedido {
  id: number;
  status: string;
  totalAmount: number;
  items: PedidoItem[];
  createdAt: string;
  User: { fullName: string };
}

interface PedidoItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  promotional_price: number | null;
  familia: string;
  imagenUrl: string | null;
}

export default function HistorialActividades() {
  const [fechaInicio, setFechaInicio] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [fechaFin, setFechaFin] = useState(format(new Date(), "yyyy-MM-dd"));
  const [familiaSeleccionada, setFamiliaSeleccionada] = useState("");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(""); // Nuevo estado para manejar el filtro de estado
  const [historial, setHistorial] = useState<Pedido[]>([]);
  const [totalOrders, setTotalOrders] = useState(0); // Guardar el total de pedidos
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 15; // Limitar a 15 pedidos por página

  useEffect(() => {
    handleBuscar();
  }, [currentPage]);

  const handleBuscar = async () => {
    try {
      const response = await fetch(`/api/administrador/getHistorial`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fechaInicio,
          fechaFin,
          familia: familiaSeleccionada,
          estado: estadoSeleccionado, // Enviar el estado seleccionado
          page: currentPage,
          limit: ordersPerPage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setHistorial(data.orders);
        setTotalOrders(data.totalOrders);
      } else {
        console.error("Error al obtener historial");
      }
    } catch (error) {
      console.error("Error al buscar historial:", error);
    }
  };

  const totalPages = Math.ceil(totalOrders / ordersPerPage); // Calcular el total de páginas

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto py-10 px-4 md:px-8 lg:px-16">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          Historial de Actividades
        </h1>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-black font-bold mb-2">
                Fecha de Inicio
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
              />
            </div>

            <div>
              <label className="block text-black font-bold mb-2">
                Fecha de Fin
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
              />
            </div>

            <div>
              <label className="block text-black font-bold mb-2">Familia</label>
              <select
                value={familiaSeleccionada}
                onChange={(e) => setFamiliaSeleccionada(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
              >
                <option value="">Todas las familias</option>
                {familias.map((familia) => (
                  <option key={familia} value={familia}>
                    {familia}
                  </option>
                ))}
              </select>
            </div>

            {/* Nuevo filtro de estado */}
            <div>
              <label className="block text-black font-bold mb-2">Estado</label>
              <select
                value={estadoSeleccionado}
                onChange={(e) => setEstadoSeleccionado(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
              >
                <option value="">Todos los estados</option>
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleBuscar}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg w-full"
          >
            Buscar
          </button>
        </div>

        {/* Tabla de resultados */}
        <div className="bg-gray-200 p-6 rounded-lg shadow-md">
          {historial.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b-2 border-gray-300 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                      N°
                    </th>
                    <th className="px-4 py-2 border-b-2 border-gray-300 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                      ID Pedido
                    </th>
                    <th className="px-4 py-2 border-b-2 border-gray-300 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                      Nombre del Cliente
                    </th>
                    <th className="px-4 py-2 border-b-2 border-gray-300 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                      Fecha Creación
                    </th>
                    <th className="px-4 py-2 border-b-2 border-gray-300 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                      Estado
                    </th>
                    <th className="px-4 py-2 border-b-2 border-gray-300 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                      Total
                    </th>
                    <th className="px-4 py-2 border-b-2 border-gray-300 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                      Productos
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((pedido, index) => (
                    <tr key={pedido.id} className="bg-white border-b">
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {(currentPage - 1) * ordersPerPage + index + 1}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {pedido.id}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {pedido.User.fullName}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {format(new Date(pedido.createdAt), "dd/MM/yyyy")}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {pedido.status}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        S/ {pedido.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {pedido.items.map((item) => (
                          <div key={item.id} className="mb-2">
                            <p>
                              <strong>Producto:</strong> {item.productName}
                            </p>
                            <p>
                              <strong>Cantidad:</strong> {item.quantity}
                            </p>
                            <p>
                              {item.promotional_price ? (
                                <>
                                  <span className="text-green-600 font-bold">
                                    S/ {item.promotional_price.toFixed(2)}
                                  </span>{" "}
                                  <span className="line-through text-red-500">
                                    S/ {item.price.toFixed(2)}
                                  </span>
                                </>
                              ) : (
                                <span>S/ {item.price.toFixed(2)}</span>
                              )}
                            </p>
                            <p>
                              <strong>Subtotal:</strong> S/{" "}
                              {(
                                (item.promotional_price || item.price) *
                                item.quantity
                              ).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-600">
              No se encontraron resultados.
            </p>
          )}
        </div>

        {/* Paginación */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-300"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white font-semibold`}
          >
            Anterior
          </button>

          <span>
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white font-semibold`}
          >
            Siguiente
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
