"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Slider from 'react-slick'; // Importar el componente Slider de react-slick

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Definimos el tipo CustomArrowProps directamente en el archivo
interface CustomArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

// Flechas personalizadas para el carrusel con tipos correctos
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

  useEffect(() => {
    setIsClient(true); // Confirmamos que estamos en el cliente
  }, []);

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
            <button className="bg-white text-yellow-500 font-bold py-2 px-4 rounded-lg">Iniciar Sesión</button>
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
