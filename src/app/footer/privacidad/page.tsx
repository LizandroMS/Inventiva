"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Product } from "@/context/CartContext";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PrivacyPolicy() {
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

      {/* Hero section */}
      <div className="relative">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white py-20 md:py-32 bg-cover bg-center bg-[url('/images/privacy-policy-hero.jpg')]">
          <h1 className="text-5xl font-extrabold mb-4">
            Políticas y Privacidad
          </h1>
          <p className="text-lg font-medium">
            Conozca cómo manejamos sus datos y garantizamos su privacidad
          </p>
        </div>
      </div>

      {/* Política de Privacidad Section */}
      <div className="container mx-auto py-12 px-6 md:px-12 lg:px-24">
        <div className="bg-white p-8 rounded-lg shadow-xl text-gray-800 leading-relaxed">
          {/* Finalidad */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-green-700 mb-6">
              1. Finalidad
            </h2>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-700">
                1.1 Compras
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Procesar la compra realizada con su consentimiento.</li>
                <li>Establecer un canal de comunicación sobre su pedido.</li>
                <li>Crear un historial de ventas para fines estadísticos.</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-700">
                1.2 Contáctenos
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Atender sus comentarios y/o dudas.</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-700">
                1.3 Quejas y Reclamos
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Responder a quejas y/o reclamos del titular de datos
                  personales.
                </li>
                <li>Registrar y cumplir con las normas del consumidor.</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-700">
                1.4 Proveedores
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Procesar y gestionar órdenes de pago, compras y operaciones
                  relacionadas a proveedores.
                </li>
              </ul>
            </div>
          </section>

          {/* Datos Personales */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-yellow-600 mb-6">
              2. Datos Personales Obligatorios
            </h2>
            <p className="mb-6">
              Para llevar a cabo las finalidades descritas, es obligatorio
              proporcionar los siguientes datos personales:
            </p>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-700">Compras</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Nombres, apellidos, número de DNI, pasaporte o carné de
                  extranjería, RUC, domicilio, correo electrónico, teléfono.
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-700">
                Contáctenos
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Nombres, apellidos, DNI o pasaporte, correo electrónico y/o
                  número telefónico.
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-700">
                Quejas y Reclamos
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Nombres, apellidos, dirección, DNI o pasaporte, teléfono, RUC,
                  firma y/o voz.
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-700">
                Proveedores
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Nombres, apellidos, dirección, DNI, pasaporte, correo, cargo,
                  razón social, RUC, firma y cuentas bancarias.
                </li>
              </ul>
            </div>
          </section>

          {/* Consecuencias */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-blue-600 mb-6">
              3. Consecuencias de No Proporcionar Datos
            </h2>
            <p className="text-lg">
              De no proporcionarnos los datos obligatorios, no se le podrá
              brindar el servicio ni atender consultas, comentarios, dudas o
              reclamos.
            </p>
          </section>

          {/* Destinatarios */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-red-600 mb-6">
              4. Destinatarios
            </h2>
            <p className="text-lg mb-4">
              Los datos pueden ser compartidos con los siguientes destinatarios:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Squarespace Payments (servicio de dominio).</li>
              <li>Railway (hosting).</li>
              <li>Empresa CORPORACIÓN SABROSITO H&V S.A.C.</li>
              <li>Administración pública según la legislación vigente.</li>
            </ul>
          </section>

          {/* Transferencias */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-green-600 mb-6">
              5. Transferencias
            </h2>
            <p className="text-lg">
              Se transfiere a San Francisco, CA, EE. UU. (proveedor de servicios
              en la nube - hosting).
            </p>
          </section>

          {/* Banco de Datos */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-yellow-600 mb-6">
              6. Banco de Datos
            </h2>
            <p className="text-lg mb-6">
              Los datos proporcionados serán incorporados en los siguientes
              bancos de datos:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Clientes (Registro Nro. 18372).</li>
              <li>Usuarios de la Página Web (Registro Nro. 20923).</li>
              <li>Quejas y Reclamos (Registro Nro. 20924).</li>
              <li>Proveedores (Registro Nro. 15648).</li>
            </ul>
          </section>

          {/* Tiempo */}
          <section>
            <h2 className="text-3xl font-bold text-blue-600 mb-6">
              7. Tiempo de Conservación
            </h2>
            <p className="text-lg">
              Los datos proporcionados se conservarán mientras no se solicite su
              cancelación por el titular.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
