"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


interface User {
  fullName: string;
  email: string;
  // Añade cualquier otra propiedad del usuario que necesites
}
export default function Header() {
  const [userName, setUserName] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem("user"); // Obtener el nombre del usuario desde localStorage
    const token = localStorage.getItem("userToken");

    if (!token || !storedName) {
      // Si no hay token o nombre, redirigir al login
      router.push("/login");
    } else {
      setUserName(JSON.parse(storedName));// Almacena el nombre del usuario en el estado
    }
  }, [router]);

  const handleLogout = () => {
    // Limpiar el localStorage (o cookies si fuera el caso)
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");

    // Redirigir al login
    router.push("/login");
  };

  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Aplicación de Gestión</h1>
        <div className="flex items-center space-x-4">
          {userName && <p>Bienvenido, {userName.fullName}</p>}{" "}
          {/* Mostrar el nombre del usuario */}
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
}
