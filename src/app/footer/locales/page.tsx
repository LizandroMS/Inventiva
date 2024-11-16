"use client";

import { useState, useEffect } from "react";
import { FaClock, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Product } from "@/context/CartContext";

interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  schedules: Schedule[];
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
        const response = await fetch("/api/getBranches");
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
    setUser(null);
    router.push("/");
    window.location.reload();
  };

  // Agrupar días consecutivos con el mismo horario
  const groupSchedules = (schedules: Schedule[]) => {
    const grouped: { days: string[]; startTime: string; endTime: string }[] = [];

    schedules.forEach((schedule, index) => {
      console.log(index)
      if (
        grouped.length > 0 &&
        grouped[grouped.length - 1].startTime === schedule.startTime &&
        grouped[grouped.length - 1].endTime === schedule.endTime
      ) {
        // Si el horario coincide con el grupo anterior, agregar el día
        grouped[grouped.length - 1].days.push(schedule.day);
      } else {
        // Crear un nuevo grupo
        grouped.push({
          days: [schedule.day],
          startTime: schedule.startTime,
          endTime: schedule.endTime,
        });
      }
    });

    return grouped;
  };

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col">
      <Header user={user} handleLogout={handleLogout} cartItems={cartItems} />

      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-semibold text-center mb-6 text-black">
          Nuestras Sucursales
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-bold mb-2 text-black">{branch.name}</h2>

              {/* Enlace a Google Maps con ícono */}
              <div className="flex items-center mb-2">
                <FaMapMarkerAlt className="text-green-700 mr-2" />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    branch.address
                  )}`}
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
                  {groupSchedules(branch.schedules).map((group, index) => (
                    <p key={index} className="text-sm text-black">
                      {group.days.join(", ")}: {group.startTime} - {group.endTime}
                    </p>
                  ))}
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

      <Footer />
    </div>
  );
}
