"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Slider from "react-slick"; // Importar el componente Slider de react-slick
import Header from "@/components/Header"; // Asegúrate de importar el Header correctamente
import { Product } from "@/context/CartContext"; // Importa el tipo Product

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { User } from "@prisma/client"; // Importa el tipo User desde Prisma si estás usando Prisma

// Definir tipos de las flechas personalizadas
interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const NextArrow = (props: ArrowProps) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: "10px", zIndex: 1 }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props: ArrowProps) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", left: "10px", zIndex: 1 }}
      onClick={onClick}
    />
  );
};

export default function Home() {
  // Estados para manejar el usuario y el carrito de compras
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Estado para almacenar el usuario
  const [cartItems, setCartItems] = useState<Product[]>([]); // Estado para almacenar los ítems en el carrito

  useEffect(() => {
    setIsClient(true);

    // Cargar usuario desde localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Cargar carrito desde localStorage
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart)); // Asegúrate de que storedCart sea un array de productos
    }
  }, []);

  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.removeItem("user"); // Limpiar datos del usuario
    setUser(null); // Limpiar el estado del usuario
  };

  // Configuración del carrusel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  // Lista de productos o platos para mostrar en el carrusel y en la sección de platos
  const Slider_Data = [
    {
      id: 1,
      nombre: "1 Pollo a la Brasa",
      precio: "S/ 45.00",
      imagen: "/images/promo1.png",
    },
    {
      id: 2,
      nombre: "1/8 Pollo a la Brasa",
      precio: "S/ 12.00",
      imagen: "/images/promo1.png",
    },
    {
      id: 3,
      nombre: "Combo Familiar",
      precio: "S/ 85.00",
      imagen: "/images/promo1.png",
    },
    {
      id: 4,
      nombre: "Pollo al Horno",
      precio: "S/ 50.00",
      imagen: "/images/promo1.png",
    },
  ];

  const platos = [
    {
      id: 1,
      nombre: "1 Pollo a la Brasa",
      precio: "S/ 45.00",
      imagen: "/images/PolloEntero.png",
    },
    {
      id: 2,
      nombre: "1/8 Pollo a la Brasa",
      precio: "S/ 12.00",
      imagen: "/images/OctavoPollo.png",
    },
  ];

  return (
    <div>
      {/* Aquí pasamos el usuario, el carrito (array de productos) y el handleLogout al Header */}
      <Header user={user} cartItems={cartItems} handleLogout={handleLogout} />

      {/* Carrusel que cubre todo el ancho */}
      {isClient && (
        <section className="bg-gray-100">
          <div className="container mx-auto p-4">
            <Slider {...settings}>
              {Slider_Data.map((item) => (
                <div
                  key={item.id}
                  className="relative w-full overflow-hidden h-[200px] sm:h-[200px] md:h-[450px]"
                >
                  <Image
                    src={item.imagen}
                    alt={item.nombre}
                    layout="fill"
                    objectFit="contain" // Cambiado a "contain"
                    objectPosition="center"
                    className="rounded-lg"
                    quality={100}
                    priority
                  />
                </div>
              ))}
            </Slider>
          </div>
        </section>
      )}

      {/* Sección de platos */}
      <section className="py-10 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">
            Nuestro Menú
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {platos.map((plato) => (
              <div
                key={plato.id}
                className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105"
              >
                <div className="relative w-full mb-4 h-[200px]">
                  <Image
                    src={plato.imagen}
                    alt={plato.nombre}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-700 text-center">
                  {plato.nombre}
                </h3>
                <p className="text-lg font-semibold text-gray-700 text-center">
                  {plato.precio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-700 text-white py-4 text-center">
        <p>© 2024 Pollería El Sabrosito. Todos los derechos reservados.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:underline">
            Términos y condiciones
          </a>
          <a href="#" className="hover:underline">
            Políticas de privacidad
          </a>
          <a href="#" className="hover:underline">
            Locales
          </a>
        </div>
      </footer>
    </div>
  );
}
