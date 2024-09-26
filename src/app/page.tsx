"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Slider from 'react-slick'; // Importar el componente Slider de react-slick

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Definir una interfaz para el usuario
interface User {
  fullName: string;
  email: string;
  // Añade cualquier otra propiedad del usuario que necesites
}

// Flechas personalizadas para el carrusel
interface CustomArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const NextArrow = (props: CustomArrowProps) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: "10px", zIndex: 1 }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props: CustomArrowProps) => {
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
  const [user, setUser] = useState<User | null>(null); // Definir el tipo de estado como 'User | null'
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // Confirmamos que estamos en el cliente

    // Verificamos si el usuario está autenticado en localStorage
    const storedUser = localStorage.getItem('user');
    console.log("storedUser",storedUser)
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // Asignar el usuario desde localStorage
      } catch (error) {
        console.error("Error al parsear el usuario del localStorage:", error);
        //localStorage.removeItem("user"); // Eliminamos el item corrupto
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user'); // Limpiamos los datos del usuario
    setUser(null); // Limpiamos el estado del usuario
    router.push('/login'); // Redirigir al usuario al login
  };

  // Configuración del slider con flechas personalizadas
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true, // Habilitar las flechas
    nextArrow: <NextArrow />, // Flecha siguiente personalizada
    prevArrow: <PrevArrow />, // Flecha anterior personalizada
  };

  // Datos de ejemplo para los platos
  const platos = [
    {
      id: 1,
      nombre: 'Pollo a la Brasa',
      precio: 'S/ 45.00',
      imagen: '/images/PolloEntero.png',
    },
    {
      id: 2,
      nombre: 'Salchipapas',
      precio: 'S/ 12.00',
      imagen: '/images/OctavoPollo.png',
    }
  ];

  return (
    <div>
      {/* Header */}
      <header className="bg-yellow-500 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/images/logo.png" alt="Pollería Logo" width={48} height={48} className="mr-4" />
            <h1 className="text-2xl font-bold">Pollería El Sabrosito</h1>
          </div>
          <nav className="flex space-x-4">
            <a href="#" className="text-white hover:text-gray-300">Inicio</a>
            <a href="#" className="text-white hover:text-gray-300">Carta</a>
            <a href="#" className="text-white hover:text-gray-300">Promociones</a>
            <a href="#" className="text-white hover:text-gray-300">Locales</a>
          </nav>

          <div className="flex space-x-4">
            {user ? (
              <>
                <span className="text-white">Bienvenido, {user.fullName}</span>
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link href="/login">
                <button className="bg-white text-yellow-500 font-bold py-2 px-4 rounded-lg">Iniciar Sesión</button>
              </Link>
            )}
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">¡Pide Online!</button>
          </div>
        </div>
      </header>

      {/* Carrusel que cubre todo el ancho */}
      {isClient && (
        <section className="py-10">
          <div className="container mx-auto">
            <Slider {...settings}>
              <div>
                <div className="relative w-full h-[400px]">
                  <Image
                    src="/images/promo2.png"
                    alt="Delivery Gratis"
                    layout="fill"
                    objectFit="cover" // Hace que la imagen cubra todo el contenedor sin desbordar
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div>
                <div className="relative w-full h-[400px]">
                  <Image
                    src="/images/promo1.png"
                    alt="Promoción 2x1"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div>
                <div className="relative w-full h-[400px]">
                  <Image
                    src="/images/promo2.png"
                    alt="Descuento en combos"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
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
          <h2 className="text-3xl font-bold mb-6 text-center">Nuestro Menú</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platos.map(plato => (
              <div key={plato.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="relative w-full h-[200px] mb-4">
                  <Image
                    src={plato.imagen}
                    alt={plato.nombre}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">{plato.nombre}</h3>
                <p className="text-lg font-semibold text-gray-700">{plato.precio}</p>
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
