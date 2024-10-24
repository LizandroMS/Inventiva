"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User } from "@prisma/client";
import { Product } from "@/context/CartContext";
import { useRouter } from "next/navigation";

interface Claim {
  id: number;
  userId: number;
  reason: string;
  description: string;
  response: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    fullName: string;
    email: string;
  };
}

export default function ClaimBook() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [wordCount, setWordCount] = useState(0); // Contador de palabras
  const maxWords = 10000; // Límite de palabras

  const router = useRouter();

  // Cargar el usuario y carrito desde el localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const storedCart = localStorage.getItem("cartItems");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      localStorage.removeItem("cartItems");
      setUser(null);
      router.push("/");
      window.location.reload();
    }
  };

  // Función para limitar palabras y ajustar textarea
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(Boolean);

    if (words.length <= maxWords) {
      setDescription(text);
      setWordCount(words.length);
    }

    // Ajustar el tamaño del textarea
    e.target.style.height = "auto"; // Reiniciar altura
    e.target.style.height = `${e.target.scrollHeight}px`; // Ajustar altura a contenido
  };

  // Obtener los reclamos del usuario autenticado
  const fetchClaims = async (userId: number) => {
    try {
      const res = await fetch(`/api/claim-book/createbook?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setClaims(data);
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

  // Ejecutar fetchClaims solo cuando el usuario esté disponible
  useEffect(() => {
    if (user && user.id) {
      fetchClaims(user.id); // Solo se ejecuta cuando el usuario está cargado
    }
  }, [user]); // Se asegura de que solo se ejecute cuando `user` cambie

  const createClaim = async () => {
    if (typeof window !== "undefined") {
      try {
        const userId = user?.id;
        if (!userId) {
          setError("No se ha encontrado el usuario.");
          return;
        }

        const res = await fetch("/api/claim-book/createbook", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, reason, description }),
        });

        if (res.ok) {
          setReason("");
          setDescription("");
          fetchClaims(userId);
        } else {
          setError("Error al crear el reclamo.");
        }
      } catch (err) {
        console.error(err);
        setError("Error al conectarse con el servidor.");
      }
    }
  };

  if (loading)
    return <p className="text-center text-gray-600">Cargando reclamos...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Header user={user} handleLogout={handleLogout} cartItems={cartItems} />

      <main className="container mx-auto py-8 px-4 flex-grow">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Libro de Reclamaciones
        </h1>

        <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-8 border border-gray-300">
          <h2 className="text-2xl font-semibold mb-4">Crear un Reclamo</h2>
          <div className="mb-4">
            <label
              className="block text-gray-800 text-sm font-bold mb-2"
              htmlFor="reason"
            >
              Motivo del Reclamo
            </label>
            <input
              id="reason"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Ingrese el motivo del reclamo"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-800 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
              placeholder="Ingrese la descripción del reclamo"
              rows={4} // Valor inicial
              style={{ overflow: "hidden" }} // Ocultar scroll
            ></textarea>
            <p className="text-sm text-gray-600 mt-1">
              {wordCount}/{maxWords} palabras
            </p>
          </div>
          <button
            onClick={createClaim}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
          >
            Crear Reclamo
          </button>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Reclamos</h2>
        {error && <p className="text-red-500">{error}</p>}
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
                <p className="text-gray-600 mb-2">Estado: {claim.status}</p>
                {claim.response && (
                  <p className="text-green-600 mb-2">
                    Respuesta: {claim.response}
                  </p>
                )}
                <p className="text-gray-600">
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
            No se encontraron reclamos.
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}
