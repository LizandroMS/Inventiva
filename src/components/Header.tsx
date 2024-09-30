import Link from "next/link";
import { Product } from "@/context/CartContext"; // Asegúrate de que este sea el tipo correcto para tus productos

interface HeaderProps {
  user: { fullName: string } | null;
  handleLogout: () => void;
  cartItems: Product[]; // Asegúrate de que cartItems sea un array de productos
}

export default function Header({ user, handleLogout, cartItems }: HeaderProps) {
  return (
    <header className="bg-yellow-500 text-white py-1 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Pollería El Sabrosito</h1>
        </div>
        <nav className="flex space-x-4">
          <Link href="/">Inicio</Link>
          <Link href="/Carta">Carta</Link>
          <Link href="/Promociones">Promocioness</Link>
        </nav>
        <div className="flex space-x-4">
          {user ? (
            <>
              <span className="pt-2.5">Bienvenido, {user.fullName}</span>
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

          {/* Carrito */}
          <Link href="/carrito">
            <div className="relative">
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                carrito ({cartItems?.length || 0}) {/* Manejar el caso cuando cartItems es undefined */}
              </button>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
