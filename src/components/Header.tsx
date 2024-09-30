import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import Image from "next/image"; // Importar el componente de imagen de Next.js
import { Product } from "@/context/CartContext";

interface HeaderProps {
  user: { fullName: string } | null;
  handleLogout: () => void;
  cartItems: Product[];
}

export default function Header({ user, handleLogout, cartItems }: HeaderProps) {
  return (
    <header className="bg-yellow-500 text-white py-1 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Imagen del logo a la izquierda */}
        <div className="flex items-center">
          <Image
            src="/images/logo.png" // Asegúrate de que esta ruta sea correcta
            alt="Logo"
            width={100}
            height={100} // Tamaño 100x100
            className="mr-4"
          />
          <h1 className="text-2xl font-bold">Pollería El Sabrosito</h1>
        </div>

        {/* Menú de navegación */}
        <nav className="flex space-x-6"> {/* Ajusté el espacio entre los elementos */}
          <Link
            href="/"
            className="text-red-600 hover:text-black transition-colors duration-300 text-lg font-semibold uppercase hover:underline"
          >
            Inicio
          </Link>
          <Link
            href="/Carta"
            className="text-red-600 hover:text-black transition-colors duration-300 text-lg font-semibold uppercase hover:underline animate-pulse" // Palpitar con animación
          >
            Carta
          </Link>
          <Link
            href="/Pedidos"
            className="text-red-600 hover:text-black transition-colors duration-300 text-lg font-semibold uppercase hover:underline"
          >
            Pedidos
          </Link>
        </nav>

        {/* Controles de usuario y carrito */}
        <div className="flex space-x-4">
          {user ? (
            <>
              <span className="pt-2.5 text-lg font-medium text-black">Bienvenido, {user.fullName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link href="/login">
              <button className="bg-white text-yellow-500 font-bold py-2 px-4 rounded-lg">
                Iniciar Sesión
              </button>
            </Link>
          )}

          {/* Carrito con ícono de react-icons */}
          <Link href="/carrito">
            <div className="relative">
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
                <FaShoppingCart className="h-6 w-6" />
                <span className="text-lg font-semibold">Carrito ({cartItems?.length || 0})</span>
              </button>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
