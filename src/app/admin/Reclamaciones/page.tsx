/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header_Interno";
import Footer from "@/components/Footer";
import { User } from "@prisma/client";

interface Claim {
  id: number;
  reason: string;
  description: string;
  createdAt: string;
  user: {
    fullName: string;
    email: string;
  };
}

export default function FilteredClaimBook() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalClaims, setTotalClaims] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Función para obtener los reclamos filtrados
  const fetchClaims = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/administrador/getReclamacion?userId=${user.id}&startDate=${startDate}&endDate=${endDate}&page=${page}&pageSize=${pageSize}`
      );
      if (res.ok) {
        const data = await res.json();
        setClaims(data.claims);
        setTotalClaims(data.totalClaims);
      } else {
        setError("Error al obtener los reclamos.");
      }
    } catch (err) {
      console.error(err);
      setError("Error al conectarse con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el filtro al hacer clic en el botón
  const handleFilter = () => {
    setPage(1); // Reiniciar la paginación cuando se cambia el filtro
    fetchClaims();
  };

  const totalPages = Math.ceil(totalClaims / pageSize);

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Header />

      <main className="container mx-auto py-8 px-4 flex-grow">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Filtrar Reclamos por Fecha
        </h1>

        <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-8 border border-gray-300">
          <h2 className="text-2xl font-semibold mb-4">Filtro de Fecha</h2>
          <div className="mb-4">
            <label className="block text-gray-800 text-sm font-bold mb-2">
              Fecha de inicio:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-800 text-sm font-bold mb-2">
              Fecha de fin:
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <button
            onClick={handleFilter} // Solo busca cuando se presiona este botón
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
          >
            Filtrar
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Cargando reclamos...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4">Reclamos</h2>
            {claims.length > 0 ? (
              <ul className="space-y-4">
                {claims.map((claim) => (
                  <li
                    key={claim.id}
                    className="bg-gray-50 p-6 rounded-lg shadow-lg border border-gray-300"
                  >
                    <h3 className="text-xl font-bold mb-2 text-gray-800">
                      Motivo: {claim.reason}
                    </h3>
                    <p className="text-gray-700 mb-2">
                      Descripción: {claim.description}
                    </p>
                    <p className="text-gray-600 mb-2">
                      Fecha: {new Date(claim.createdAt).toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      Usuario: {claim.user?.fullName} ({claim.user?.email})
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-700">
                No se encontraron reclamos en este rango de fechas.
              </p>
            )}

            {/* Paginación */}
            <div className="mt-6 flex justify-center items-center">
              <button
                disabled={page <= 1}
                onClick={() => {
                  setPage(page - 1);
                  fetchClaims(); // Volver a ejecutar la búsqueda
                }}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-l-lg"
              >
                Anterior
              </button>
              <span className="mx-4">
                Página {page} de {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => {
                  setPage(page + 1);
                  fetchClaims(); // Volver a ejecutar la búsqueda
                }}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-r-lg"
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
