import React, { useState } from "react";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import Image from "next/image";
import { Product } from "@/context/CartContext";

interface HeaderProps {
  user: { fullName: string } | null;
  handleLogout: () => void;
  cartItems: Product[];
}

export default function Header({ user, handleLogout, cartItems }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-yellow-500 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Sección Izquierda: Logo e imagen */}
        <div className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={80}
            height={80}
            className="mr-2"
          />
          <h1 className="text-xl md:text-3xl font-bold whitespace-nowrap">
            Pollería El Sabrosito
          </h1>
        </div>

        {/* Sección Central: Enlaces de navegación */}
        <nav className="hidden md:flex space-x-6">
          <Link
            href="/"
            className="text-red-600 hover:text-black transition-colors duration-300 text-lg font-semibold uppercase"
          >
            Inicio
          </Link>
          <Link
            href="/Carta"
            className="text-red-600 hover:text-black transition-colors duration-300 text-lg font-semibold uppercase animate-pulse"
          >
            Carta
          </Link>
          <Link
            href="/Pedidos"
            className="text-red-600 hover:text-black transition-colors duration-300 text-lg font-semibold uppercase"
          >
            Pedidos
          </Link>
        </nav>

        {/* Sección Derecha: Botón del carrito y controles de usuario */}
        <div className="flex items-center space-x-4">
          {/* Botón del carrito visible en todas las pantallas */}
          <Link href="/carrito">
            <div className="relative">
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold p-2 rounded-lg flex items-center">
                <FaShoppingCart className="h-6 w-6" />
                {/* Mostrar el contador si hay artículos en el carrito */}
                {cartItems.length > 0 && (
                  <span className="ml-1 text-lg font-semibold">
                    ({cartItems.length})
                  </span>
                )}
              </button>
            </div>
          </Link>

          {/* Botón de menú hamburguesa para móviles */}
          <div className="md:hidden">
            <button
              id="mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white focus:outline-none focus:ring-2 focus:ring-white"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>

          {/* Controles de usuario en pantallas md y superiores */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <span className="text-lg font-medium text-black">
                  Bienvenido, {user.fullName}
                </span>
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
          </div>
        </div>
      </div>

      {/* Menú desplegable en móviles */}
      <div
        className={`md:hidden ${isMobileMenuOpen ? "" : "hidden"}`}
        id="mobile-menu"
      >
        <nav className="flex flex-col items-center space-y-4 mt-4">
          <Link href="/" className="text-white text-lg">
            Inicio
          </Link>
          <Link href="/Carta" className="text-white text-lg">
            Carta
          </Link>
          <Link href="/Pedidos" className="text-white text-lg">
            Pedidos
          </Link>

          {/* Controles de usuario en móvil */}
          <div className="flex flex-col items-center space-y-4 mt-4">
            {user ? (
              <>
                <span className="text-lg font-medium text-black">
                  Bienvenido, {user.fullName}
                </span>
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
          </div>
        </nav>
      </div>
    </header>
  );
}
