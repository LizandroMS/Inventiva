"use client";
import Footer from "@/components/Footer";
import { User } from "@prisma/client";
import { Product } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function TermsAndConditions() {
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
          Términos y Condiciones
        </h1>
        <div className="bg-white p-8 rounded-lg shadow-lg text-gray-800 leading-relaxed">
          <h2 className="text-3xl font-bold mt-4 mb-6">
            1. Condición de Nuestro Servicio
          </h2>
          <p className="mb-6">
            En nuestro sitio web (
            <a
              href="https://www.polleriasabrosito.com/"
              className="text-blue-600 underline"
            >
              https://www.polleriasabrosito.com/
            </a>
            ), nos comprometemos a leer nuestros Términos y Condiciones del
            Servicio Online. Al utilizar nuestro sitio web, usted acepta
            nuestros términos y condiciones del servicio. Si no los acepta, le
            solicitamos que no use el sitio web ni se registre, ya que estaría
            haciendo uso inadecuado de nuestra plataforma.
          </p>
          <p className="mb-6">
            El servicio online está dirigido a todo el público, y nuestro
            propósito es proporcionar términos y condiciones claros y precisos
            para que pueda tomar la mejor decisión en la elección de su pedido.
          </p>

          <h2 className="text-3xl font-bold mt-8 mb-6">
            2. Aceptación de Términos
          </h2>
          <p className="mb-6">
            El servicio de El Sabrosito a través de nuestro sitio web está
            disponible para nuestros clientes online bajo su responsabilidad.
            Solicitamos que no se aprovechen de fallos que puedan ocurrir. Si
            encuentra alguna falla en nuestro servicio, le pedimos que la
            reporte al número +51 914 934 631.
          </p>
          <p className="mb-6 font-semibold">
            *Nota: No se incluye el costo de delivery.
          </p>

          <h2 className="text-3xl font-bold mt-8 mb-6">3. Importante</h2>

          <h3 className="text-2xl font-semibold mt-4 mb-4">
            3.1 Zona de Reparto
          </h3>
          <p className="mb-6">
            Las zonas de reparto están informadas en nuestro sitio web. Deben
            ser validadas con la dirección de reparto de cada cliente online.
            Para visualizar las zonas de reparto (cobertura), haga clic{" "}
            <a href="/footer/locales" className="text-blue-600 underline">
              aquí
            </a>
            .
          </p>

          <h3 className="text-2xl font-semibold mt-4 mb-4">
            3.2 Costo por el Servicio de Delivery
          </h3>
          <p className="mb-6">
            Informamos a nuestros clientes que el costo del servicio de delivery
            es de 4 soles en adelante, dependiendo de la ubicación.
          </p>

          <h3 className="text-2xl font-semibold mt-4 mb-4">
            3.3 Programación de Entrega
          </h3>
          <p className="mb-6">
            La programación de entrega se basará en el horario en que se realizó
            el pedido, teniendo en cuenta la zona de reparto. El tiempo promedio
            de entrega varía entre 35 a 50 minutos. Este tiempo puede variar
            durante fechas festivas o por alta demanda.
          </p>

          <h2 className="text-3xl font-bold mt-8 mb-6">
            4. Política de Cambios y/o Devoluciones
          </h2>
          <p className="mb-6">
            El Sabrosito ofrece las siguientes modalidades para cambios o
            devoluciones de productos:
          </p>

          <h3 className="text-2xl font-semibold mt-4 mb-4">
            4.1 Producto Entregado
          </h3>
          <p className="mb-4">Cuando el producto ha sido entregado:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>
              Si el producto no corresponde a lo que pidió, será analizado.
            </li>
            <li>Si es un error del cliente, no procederá el cambio.</li>
            <li>
              Si es un error nuestro, procederemos con el cambio del producto.
            </li>
            <li>Si el producto es el correcto, no se realizará el cambio.</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-4 mb-4">
            4.2 Producto No Entregado
          </h3>
          <p className="mb-6">
            Los clientes tienen 15 minutos después de realizar su pedido para
            solicitar un cambio llamando al número +51 914 931 631.
          </p>

          <h3 className="text-2xl font-semibold mt-4 mb-4">
            4.2.3 Devoluciones
          </h3>
          <ul className="list-disc pl-6 mb-6">
            <li>
              Si el producto no corresponde a lo que pidió, será analizado.
            </li>
            <li>
              Si es un error del cliente, no procederá el cambio o devolución
              del dinero.
            </li>
            <li>
              Si es un error nuestro, procederemos con el cambio del producto o
              la devolución del dinero.
            </li>
            <li>
              Si el producto es el correcto, no se realizará la devolución.
            </li>
          </ul>

          <h2 className="text-3xl font-bold mt-8 mb-6">
            5. Ofertas / Precios Bajos
          </h2>
          <p className="mb-6">
            Las ofertas y precios bajos en nuestro sitio web (
            <a
              href="https://www.polleriasabrosito.com/"
              className="text-blue-600 underline"
            >
              https://www.polleriasabrosito.com/
            </a>
            ) solo aplican para compras online. Si desea comprar en la tienda
            física, el precio puede variar.
          </p>
          <h2 className="text-3xl font-bold mt-8 mb-6">
            6. Publicidad Y Promociones
          </h2>
          <p className="mb-6">
            Aceptas que la empresa Corporacion Sabrosito H&V S.A.C. pueda enviarte correos y mensajes de promociones y/o publicidad.

          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
