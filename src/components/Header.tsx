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
            width={60}
            height={60}
            className="mr-2"
          />
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold whitespace-nowrap">
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
              className="text-red-600 hover:text-black transition-colors duration-300 text-base font-semibold uppercase"
            >
              Inicio
            </Link>
            <Link
              href="/Carta"
              className="text-red-600 hover:text-black transition-colors duration-300 text-base font-semibold uppercase animate-pulse"
            >
              Carta
            </Link>
            <Link
              href="/Pedidos"
              className="text-red-600 hover:text-black transition-colors duration-300 text-base font-semibold uppercase"
            >
              Pedidos
            </Link>
          </nav>

          {/* Botón del carrito */}
          <Link href="/carrito">
            <div className="relative">
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold p-2 rounded-lg flex items-center">
                <FaShoppingCart className="h-6 w-6" />
                {cartItems.length > 0 && (
                  <span className="ml-1 text-lg font-semibold">
                    ({cartItems.length})
                  </span>
                )}
              </button>
            </div>
          </Link>

          {/* Controles de usuario */}
          {user ? (
            <>
              <span className="text-base font-medium text-black">
                Bienvenido, {user.fullName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link href="/login">
              <button className="bg-white text-yellow-500 font-bold py-1 px-3 rounded-lg">
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
        <nav className="flex flex-col items-center space-y-4 mt-4">
          <Link
            href="/"
            className="text-white text-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link
            href="/Carta"
            className="text-white text-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Carta
          </Link>
          <Link
            href="/Pedidos"
            className="text-white text-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Pedidos
          </Link>

          {/* Botón del carrito */}
          <Link href="/carrito">
            <div className="relative">
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-bold p-2 rounded-lg flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaShoppingCart className="h-6 w-6" />
                {cartItems.length > 0 && (
                  <span className="ml-1 text-lg font-semibold">
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
                <span className="text-lg font-medium text-black">
                  Bienvenido, {user.fullName}
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link href="/login">
                <button
                  className="bg-white text-yellow-500 font-bold py-2 px-4 rounded-lg"
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
