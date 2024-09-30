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

  // Lista de productos para mostrar
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
          <div className="container mx-auto">
            <Slider {...settings}>
              <div>
                <div className="relative w-full h-[500px] overflow-hidden">
                  <Image
                    src="/images/promo2.png"
                    alt="Delivery Gratis"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                    className="rounded-lg"
                    quality={100}
                  />
                </div>
              </div>

              <div>
                <div className="relative w-full h-[500px] overflow-hidden">
                  <Image
                    src="/images/promo1.png"
                    alt="Promoción 2x1"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                    className="rounded-lg"
                    quality={100}
                  />
                </div>
              </div>

              <div>
                <div className="relative w-full h-[500px] overflow-hidden">
                  <Image
                    src="/images/promo2.png"
                    alt="Descuento en combos"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                    className="rounded-lg"
                    quality={100}
                  />
                </div>
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platos.map((plato) => (
              <div key={plato.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="relative w-full mb-4">
                  <Image
                    src={plato.imagen}
                    alt={plato.nombre}
                    width={400}
                    height={400}
                    layout="intrinsic"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-700">
                  {plato.nombre}
                </h3>
                <p className="text-lg font-semibold text-gray-700">
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
          <a href="#">Términos y condiciones</a>
          <a href="#">Políticas de privacidad</a>
          <a href="#">Locales</a>
        </div>
      </footer>
    </div>
  );
}
