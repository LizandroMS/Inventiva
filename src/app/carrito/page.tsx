"use client";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Para redirigir al usuario
import { User } from "@prisma/client";
import { io } from "socket.io-client";

// Inicializar el socket
const socket = io({
  path: "/api/socket",
});

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart, updateCartItemQuantity } =
    useCart(); // Agrega updateCartItemQuantity
  const [user, setUser] = useState<User | null>(null);
  const [observations, setObservations] = useState<{ [key: number]: string }>(
    {}
  ); // Para almacenar observaciones por producto
  const router = useRouter(); // Redireccionar si es necesario

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

  // Realizar el cálculo del total basado en el precio promocional o regular
  const totalPrice = cartItems.reduce(
    (total, item) =>
      total +
      (item.promotional_price ? item.promotional_price : item.price) *
        item.quantity,
    0
  );

  // Función para guardar el pedido
  const handleOrder = async () => {
    if (!user) {
      alert("Por favor inicia sesión para proceder con el pedido.");
      return;
    }

    try {
      const response = await fetch("/api/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id, // ID del usuario
          items: cartItems.map((item) => ({
            ...item,
            observation: observations[item.id] || "", // Añadir la observación si la tiene
          })),
          totalAmount: totalPrice,
        }),
      });

      if (response.ok) {
        clearCart(); // Limpia el carrito

        // Emitir el pedido a través del socket
        socket.emit("newOrder");
        console.log("newOrder");
        router.push("/Pedidos");
      } else {
        console.error("Error al crear el pedido.");
      }
    } catch (error) {
      console.error("Error al crear el pedido:", error);
    }
  };

  // Manejar el cambio de cantidad a través de los botones
  const handleIncrement = (id: number) => {
    const currentItem = cartItems.find((item) => item.id === id);
    if (currentItem) {
      updateCartItemQuantity(id, currentItem.quantity + 1);
    }
  };

  const handleDecrement = (id: number) => {
    const currentItem = cartItems.find((item) => item.id === id);
    if (currentItem && currentItem.quantity > 1) {
      updateCartItemQuantity(id, currentItem.quantity - 1);
    }
  };

  // Manejar el cambio de observaciones
  const handleObservationChange = (id: number, value: string) => {
    setObservations((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header reutilizable */}
      <Header
        user={user}
        handleLogout={() => setUser(null)}
        cartItems={cartItems}
      />

      {/* Contenido del carrito */}
      <main className="flex-grow">
        <div className="container mx-auto py-8">
          {cartItems.length > 0 ? (
            <>
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

                    {/* Mostrar precios */}
                    {item.promotional_price ? (
                      <div className="text-center">
                        <p className="text-lg font-semibold text-green-600">
                          S/ {item.promotional_price.toFixed(2)}
                        </p>
                        <p className="text-lg text-red-500 line-through">
                          S/ {item.price.toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-lg font-semibold text-center text-gray-700">
                        S/ {item.price.toFixed(2)}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-sm text-center text-gray-600 mt-2">
                        {item.description}
                      </p>
                    )}

                    {/* Selección de cantidad con botones */}
                    <div className="mt-4 flex items-center space-x-2">
                      <button
                        onClick={() => handleDecrement(item.id)}
                        className="bg-gray-300 px-3 py-1 rounded-lg"
                      >
                        -
                      </button>
                      <span className="text-lg font-semibold text-gray-700">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrement(item.id)}
                        className="bg-gray-300 px-3 py-1 rounded-lg"
                      >
                        +
                      </button>
                    </div>

                    {/* Campo de observación */}
                    <textarea
                      placeholder="Agregar observaciones"
                      value={observations[item.id] || ""}
                      onChange={(e) =>
                        handleObservationChange(item.id, e.target.value)
                      }
                      className="mt-4 w-full p-2 border rounded-lg"
                    ></textarea>

                    {/* Botón Eliminar */}
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
                <button
                  onClick={handleOrder} // Llama a la función handleOrder cuando se hace clic
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg w-full mt-6 transition-colors"
                >
                  Proceder con el pedido
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
