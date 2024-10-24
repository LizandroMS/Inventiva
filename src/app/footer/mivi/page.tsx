"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Product } from "@/context/CartContext";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MissionVision() {
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const router = useRouter();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

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
      <Header user={user} handleLogout={handleLogout} cartItems={cartItems} />
      <div className="container mx-auto py-12 px-6 md:px-12 lg:px-24">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900">
          Nuestra Misión y Visión
        </h1>
        <div className="bg-white p-8 rounded-lg shadow-lg text-gray-800 leading-relaxed">
          {/* Misión */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-green-600 mb-4">Misión</h2>
            <p className="text-lg mb-4">
              Elaborar y ofrecer principalmente el mejor pollo a la brasa en
              nuestra zona, con una variedad de platos a la carta, chifa y
              parrillas, utilizando insumos de alta calidad que son oriundos de
              la zona. Nuestro compromiso es también brindar la mejor atención a
              nuestros clientes, haciendo que se sientan especiales y valorados.
            </p>
          </section>

          {/* Visión */}
          <section>
            <h2 className="text-3xl font-bold text-yellow-600 mb-4">Visión</h2>
            <p className="text-lg">
              Consolidarnos como la primera empresa de Barranca en tener una
              cadena de pollerías a nivel nacional, con un alto reconocimiento
              en el sabor de nuestros productos. Además, buscamos brindar un
              servicio de excelencia a través de nuestro dedicado equipo de
              trabajo.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
