"use client";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Tu Carrito</h1>
      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={item.imagenUrl || "/images/default.png"}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
              <p className="text-lg font-semibold text-gray-700">{item.price}</p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg mt-4"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-700">Tu carrito está vacío.</p>
      )}
    </div>
  );
}
