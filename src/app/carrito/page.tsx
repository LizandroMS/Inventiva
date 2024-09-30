"use client";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Header from "@/components/Header"; // Asegúrate de tener este componente disponible
import { useState, useEffect } from "react";

interface User {
  fullName: string;
  email: string;
}

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();
  const [user, setUser] = useState<User | null>(null);

  // Simulación de la función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // Obtener la información del usuario desde localStorage
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

  // Calcular el total del carrito
  const totalPrice = cartItems.reduce(
    (total, item) => total + parseFloat(item.price),
    0
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header reutilizable */}
      <Header user={user} handleLogout={handleLogout} cartItems={cartItems} />

      {/* Contenido del carrito */}
      <main className="flex-grow">
        <div className="container mx-auto py-8">
          {cartItems.length > 0 ? (
            <>
              {/* Productos en el carrito */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center"
                  >
                    <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                      <Image
                        src={item.imagenUrl || "/images/default.png"}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-center text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-lg font-semibold text-center text-gray-600">
                      S/ {item.price}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg mt-4 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>

              {/* Total del carrito */}
              <div className="mt-8 p-4 bg-gray-200 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-700 text-center">
                  Total a pagar: S/ {totalPrice.toFixed(2)}
                </h2>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg w-full mt-6 transition-colors">
                  Proceder con el pago
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-700">Tu carrito está vacío.</p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-700 text-white py-4 text-center mt-auto">
        <p>© 2024 Pollería El Sabrosito. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
