"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Slider from "react-slick"; // Importar el componente Slider de react-slick
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header"; // Importa el Header reutilizable

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Definir una interfaz para el usuario
interface User {
  fullName: string;
  email: string;
}

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
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { cartItems } = useCart(); // Para mostrar la cantidad de productos en el carrito
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    // Verificamos si el usuario está autenticado en localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // Asignar el usuario desde localStorage
      } catch (error) {
        console.error("Error al parsear el usuario del localStorage:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Limpiamos los datos del usuario
    setUser(null); // Limpiamos el estado del usuario
    router.push("/login"); // Redirigir al usuario al login
  };

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
      {/* Header reutilizable */}
      <Header user={user} handleLogout={handleLogout} cartItems={cartItems} />

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
