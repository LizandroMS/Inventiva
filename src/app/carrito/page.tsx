"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation"; // Para redirigir al usuario
import { io } from "socket.io-client";
import Image from "next/image"; // Mantener el uso de Image de Next.js
import WhatsappButton from "@/components/WhatsappButton";

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
  const [paymentType, setPaymentType] = useState("Boleta"); // Boleta por defecto
  const [ruc, setRuc] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");

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

    // Validar si se selecciona factura y si se han llenado los campos requeridos
    if (paymentType === "Factura" && (!ruc || !companyName || !companyAddress)) {
      alert("Por favor, complete los campos requeridos para la Factura.");
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
            id: item.id,
            productName: item.name, // Nombre del producto en el momento del pedido
            price: item.price, // Precio regular del producto
            promotional_price: item.promotional_price || null, // Precio promocional, si lo hay
            familia: item.familia || "Sin familia", // Familia del producto
            quantity: item.quantity, // Cantidad comprada
            totalPrice: (item.promotional_price || item.price) * item.quantity, // Total para este producto
            observation: observations[item.id] || "", // Observaciones, si las hay
            imagenUrl: item.imagenUrl,
            description: item.description,
          })),
          totalAmount: totalPrice, // El total de la orden completa
          paymentType, // Boleta o Factura
          ruc: paymentType === "Factura" ? ruc : null,
          companyName: paymentType === "Factura" ? companyName : null,
          companyAddress: paymentType === "Factura" ? companyAddress : null,
        }),
      });

      if (response.ok) {
        clearCart(); // Limpia el carrito
        const nuevoEstado: string = "";

        // Emitir el pedido a través del socket
        socket.emit("newOrder",{ CANCELACION: nuevoEstado });
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

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
    setUser(null); // Limpiar el estado del usuario
    router.push("/");
    window.location.reload();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header reutilizable */}
      <Header user={user} handleLogout={handleLogout} cartItems={cartItems} />

      {/* Contenido del carrito */}
      <main className="flex-grow">
        <div className="container mx-auto py-8 px-4 md:px-8 lg:px-16">
          {cartItems.length > 0 ? (
            <>
              {/* Grid responsivo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
                    <h3 className="text-xl font-bold text-center text-black">
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
                      <p className="text-lg font-semibold text-center text-black">
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
                        className="bg-gray-300 px-3 py-1 rounded-lg text-black"
                      >
                        -
                      </button>
                      <span className="text-lg font-semibold text-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrement(item.id)}
                        className="bg-gray-300 px-3 py-1 rounded-lg text-black"
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
                      className="mt-4 w-full p-2 border rounded-lg text-black"
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

              {/* Opciones de Boleta o Factura */}
              <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-bold text-black">Comprobante de pago:</h2>
                <div className="flex items-center mt-4 space-x-6">
                  <label className="flex items-center text-black cursor-pointer">
                    <input
                      type="radio"
                      name="paymentType"
                      value="Boleta"
                      checked={paymentType === "Boleta"}
                      onChange={(e) => setPaymentType(e.target.value)}
                      className="mr-2 accent-yellow-500"
                    />
                    <span className="text-lg">Boleta</span>
                  </label>
                  <label className="flex items-center text-black cursor-pointer">
                    <input
                      type="radio"
                      name="paymentType"
                      value="Factura"
                      checked={paymentType === "Factura"}
                      onChange={(e) => setPaymentType(e.target.value)}
                      className="mr-2 accent-blue-500"
                    />
                    <span className="text-lg">Factura</span>
                  </label>
                </div>

                {/* Mostrar campos adicionales si se selecciona Factura */}
                {paymentType === "Factura" && (
                  <div className="mt-4 space-y-4">
                    <input
                      type="text"
                      placeholder="RUC"
                      value={ruc}
                      onChange={(e) => setRuc(e.target.value)}
                      className="w-full p-2 border rounded-lg text-black"
                    />
                    <input
                      type="text"
                      placeholder="Nombre de la empresa"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full p-2 border rounded-lg text-black"
                    />
                    <input
                      type="text"
                      placeholder="Dirección de la empresa"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      className="w-full p-2 border rounded-lg text-black"
                    />
                  </div>
                )}
              </div>

              {/* Total del carrito */}
              <div className="mt-8 p-4 bg-gray-200 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-black text-center">
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
      <Footer />
      <WhatsappButton
        phoneNumber="993250683"
        message="Hola, me gustaría saber más sobre sus productos!"
      />
    </div>
  );
}
