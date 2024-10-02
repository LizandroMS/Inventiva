"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaSignOutAlt } from "react-icons/fa"; // Íconos para mejorar la UI

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
      setUserName(JSON.parse(storedName)); // Almacena el nombre del usuario en el estado
    }
  }, [router]);

  const handleLogout = () => {
    // Limpiar el localStorage (o cookies si fuera el caso)
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");

    // Redirigir al login
    router.push("/login");
  };

  const handleGoBack = () => {
    router.back(); // Función de retroceso para ir a la página anterior
  };

  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Título de la aplicación */}
        <h1 className="text-2xl font-bold text-center sm:text-left">
          Aplicación de Gestión
        </h1>

        {/* Botones y nombre de usuario */}
        <div className="flex items-center space-x-4">
          {userName && (
            <p className="hidden sm:block font-semibold text-lg">
              Bienvenido, {userName.fullName}
            </p>
          )}

          {/* Botón de retroceso */}
          <button
            onClick={handleGoBack}
            className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            <FaArrowLeft className="h-5 w-5" />
            <span className="hidden md:inline-block">Volver</span>
          </button>

          {/* Botón de cerrar sesión */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            <FaSignOutAlt className="h-5 w-5" />
            <span className="hidden md:inline-block">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Separador para pantallas pequeñas con nombre de usuario */}
      {userName && (
        <div className="sm:hidden text-center mt-4 text-lg font-semibold">
          Bienvenido, {userName.fullName}
        </div>
      )}
    </header>
  );
}
