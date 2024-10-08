"use client";

import { useState, useEffect } from "react";
import { FaClock, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa"; // Importamos el ícono de ubicación
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {  User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Product } from "@/context/CartContext";

interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
}

export default function Locales() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("/api/getBranches"); // La URL debe coincidir con tu ruta de API
        if (!response.ok) {
          throw new Error("Error al obtener las sucursales");
        }
        const data = await response.json();
        setBranches(data);
        setLoading(false);
      } catch (error) {
        setError("Error al obtener las sucursales");
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;


  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
    setUser(null); // Limpiar el estado del usuario
    router.push("/");
    window.location.reload(); 
  };

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col"> {/* Fondo gris */}
      <Header
        user={user}
        handleLogout={handleLogout}
        cartItems={cartItems}
      />
      
      <div className="container mx-auto px-4 py-8 flex-grow"> {/* Container centrado con flex-grow para llenar la pantalla */}
        <h1 className="text-2xl font-semibold text-center mb-6 text-black">Nuestras Sucursales</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {branches.map((branch) => (
            <div key={branch.id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300"> {/* Fondo blanco para las tarjetas */}
              <h2 className="text-xl font-bold mb-2 text-black">{branch.name}</h2>

              {/* Enlace a Google Maps con ícono */}
              <div className="flex items-center mb-2">
                <FaMapMarkerAlt className="text-green-700 mr-2" />
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-black underline hover:text-green-700 transition-colors duration-300"
                >
                  {branch.address}
                </a>
              </div>
              
              <div className="flex items-center mt-2">
                <FaClock className="text-green-700 mr-2" />
                <div>
                  <p className="font-semibold text-sm text-black">Horario de tienda</p>
                  <p className="text-sm text-black">Domingo a Jueves 11:00 am - 11:30 pm</p>
                  <p className="text-sm text-black">Viernes a Sábado 11:00 am - 12:30 am</p>
                </div>
              </div>

              <div className="flex items-center mt-4">
                <FaPhoneAlt className="text-green-700 mr-2" />
                <div>
                  <p className="font-semibold text-sm text-black">Teléfono</p>
                  <p className="text-sm text-black">{branch.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer /> {/* Incluimos el footer reutilizable */}
    </div>
  );
}
