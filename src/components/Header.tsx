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
    <header className="bg-gradient-to-r from-yellow-400 via-red-400 to-red-600 text-white shadow-lg">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Sección Izquierda: Logo e imagen */}
        <div className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={100}
            height={100}
            className="mr-2 rounded-full border-2 border-white"
          />
          <h1 className="text-lg md:text-xl lg:text-2xl font-extrabold whitespace-nowrap tracking-wider">
            Pollería El Sabrosito
          </h1>
        </div>

        {/* Botón de menú hamburguesa para móviles y tablets */}
        <div className="lg:hidden">
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
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m4 6H4"
                ></path>
              )}
            </svg>
          </button>
        </div>

        {/* Sección Central: Enlaces de navegación y controles de usuario en pantallas grandes */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* Enlaces de navegación */}
          <nav className="flex space-x-6">
            <Link
              href="/"
              className="text-white hover:text-yellow-200 transition-all duration-300 text-base font-semibold uppercase"
            >
              Inicio
            </Link>
            <Link
              href="/Carta"
              className="text-white hover:text-yellow-200 transition-all duration-300 text-base font-semibold uppercase animate-bounce"
            >
              Carta
            </Link>
            <Link
              href="/Pedidos"
              className="text-white hover:text-yellow-200 transition-all duration-300 text-base font-semibold uppercase"
            >
              Pedidos
            </Link>
          </nav>

          {/* Botón del carrito */}
          <Link href="/carrito">
            <div className="relative">
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold p-2 rounded-full flex items-center shadow-lg transition-transform transform hover:scale-105 border-2 border-black">
                <FaShoppingCart className="h-6 w-6" />
                {cartItems.length > 0 && (
                  <span className="ml-1 text-lg font-semibold bg-yellow-500 text-black px-2 py-1 rounded-full">
                    ({cartItems.length})
                  </span>
                )}
              </button>
            </div>
          </Link>

          {/* Controles de usuario */}
          {user ? (
            <>
              <span className="text-base font-medium text-yellow-100 shadow-lg">
                Bienvenido, {user.fullName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link href="/login">
              <button className="bg-white text-yellow-600 font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                Iniciar Sesión
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Menú desplegable en móviles y tablets */}
      <div
        className={`lg:hidden ${isMobileMenuOpen ? "" : "hidden"}`}
        id="mobile-menu"
      >
        <nav className="flex flex-col items-center space-y-4 mt-4 bg-yellow-500 text-white py-4 rounded-lg shadow-lg">
          <Link
            href="/"
            className="text-lg hover:bg-yellow-600 px-4 py-2 rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link
            href="/Carta"
            className="text-lg hover:bg-yellow-600 px-4 py-2 rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Carta
          </Link>
          <Link
            href="/Pedidos"
            className="text-lg hover:bg-yellow-600 px-4 py-2 rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Pedidos
          </Link>

          {/* Botón del carrito */}
          <Link href="/carrito">
            <div className="relative">
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold p-2 rounded-full flex items-center shadow-lg transition-transform transform hover:scale-105 border-2 border-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaShoppingCart className="h-6 w-6" />
                {cartItems.length > 0 && (
                  <span className="ml-1 text-lg font-semibold bg-yellow-500 text-black px-2 py-1 rounded-full">
                    ({cartItems.length})
                  </span>
                )}
              </button>
            </div>
          </Link>

          {/* Controles de usuario en móvil */}
          <div className="flex flex-col items-center space-y-4 mt-4">
            {user ? (
              <>
                <span className="text-lg font-medium text-yellow-100">
                  Bienvenido, {user.fullName}
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link href="/login">
                <button
                  className="bg-white text-yellow-600 font-bold py-2 px-4 rounded-lg shadow-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
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
