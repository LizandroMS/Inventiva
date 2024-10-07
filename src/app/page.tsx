"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Product } from "@/context/CartContext";
import { useRouter } from "next/navigation"; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
      style={{
        ...style,
        display: "block",
        right: "10px",
        zIndex: 1,
      }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props: ArrowProps) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        left: "10px",
        zIndex: 1,
      }}
      onClick={onClick}
    />
  );
};

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const router = useRouter();
  useEffect(() => {
    setIsClient(true);

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
    setUser(null);
    router.push("/");
    window.location.reload(); 
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
      imagen: "/images/PolloEntero.png",
    },
    {
      id: 2,
      nombre: "Chifa",
      imagen: "/images/OctavoPollo.png",
    },
    {
      id: 3,
      nombre: "Platos a la Carta",
      imagen: "/images/PolloEntero.png",
    },
    {
      id: 4,
      nombre: "Parrillas",
      imagen: "/images/OctavoPollo.png",
    },
    // Agrega más categorías según necesites
  ];

  return (
    <div>
      <Header user={user} cartItems={cartItems} handleLogout={handleLogout} />

      {isClient && (
        <section className="bg-gray-100 pt-6">
          <div className="container mx-auto px-4">
            <Slider {...settings}>
              {Slider_Data.map((item) => (
                <div
                  key={item.id}
                  className="relative w-full overflow-hidden h-[200px] sm:h-[300px] md:h-[450px]"
                >
                  <Image
                    src={item.imagen}
                    alt={item.nombre}
                    layout="fill"
                    objectFit="cover"
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
        <div className="max-w-7xl mx-auto px-4">
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
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer">
                  {/* Nombre en la parte superior */}
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-700 text-center">
                      {plato.nombre}
                    </h3>
                  </div>
                  {/* Imagen */}
                  <div className="relative w-full h-48 md:h-56 lg:h-64 overflow-hidden">
                    <Image
                      src={plato.imagen}
                      alt={plato.nombre}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
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
