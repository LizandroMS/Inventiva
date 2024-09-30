"use client";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  fullName: string;
  email: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const { cartItems } = useCart();
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error al parsear el usuario del localStorage:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="bg-yellow-500 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Pollería Logo"
            width={60}
            height={60}
            className="mr-4"
          />
          <h1 className="text-2xl font-bold">Pollería El Sabrosito</h1>
        </div>

        <div className="flex space-x-4 items-center">
          <Link href="/cart">
            <button className="bg-white text-yellow-500 font-bold py-2 px-4 rounded-lg relative">
              🛒 Carrito
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {cartItems.length}
              </span>
            </button>
          </Link>

          {user ? (
            <>
              <span className="text-white text-sm">
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
            <button
              onClick={() => router.push("/login")}
              className="bg-white text-yellow-500 font-bold py-2 px-4 rounded-lg"
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
