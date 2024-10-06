"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import Header from "@/components/Header";
import { Product } from "@/context/CartContext";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { User } from "@prisma/client";
import Footer from "@/components/Footer";

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
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    setIsClient(true);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
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
      nombre: "Pollos a la Brasa",
      //precio: "Desde S/ 12.00",
      imagen: "/images/PolloEntero.png",
    },
    {
      id: 2,
      nombre: "Chifa",
      // precio: "Desde S/ 15.00",
      imagen: "/images/OctavoPollo.png",
    },
    // Agrega más categorías según necesites
  ];

  return (
    <div>
      <Header user={user} cartItems={cartItems} handleLogout={handleLogout} />

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
                    objectFit="contain"
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

      <section className="py-10 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">
            Nuestro Menú
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {platos.map((plato) => (
              <Link
                key={plato.id}
                href={{
                  pathname: "/Carta",
                  query: { categoria: plato.nombre },
                }}
              >
                <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105 cursor-pointer">
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
                  {/* <p className="text-lg font-semibold text-gray-700 text-center">
                    {plato.precio}
                  </p> */}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
