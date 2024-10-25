"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Product } from "@/context/CartContext";
import { User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function AboutUs() {
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
        <Image
          src="/images/Todo_personal.jpg" // Asegúrate de tener una imagen atractiva en esta ruta
          alt="Nosotros"
          layout="fill"
          objectFit="cover"
          className="w-full h-64 md:h-96 p-100"
        />
        <div className="relative z-10 text-center text-white py-20 md:py-32">
          <h1 className="text-5xl font-extrabold mb-4">Sobre Nosotros</h1>
          <p className="text-lg font-medium">
            Nuestra historia, compromiso y evolución a lo largo de los años
          </p>
        </div>
      </div>

      {/* Nosotros Section */}
      <div className="container mx-auto py-12 px-6 md:px-12 lg:px-24">
        <div className="bg-white p-8 rounded-lg shadow-xl text-gray-800 leading-relaxed">
          {/* Historia */}
          <section className="mb-12">
            <h2 className="text-4xl font-bold text-green-700 mb-6">
              Nuestra Historia
            </h2>
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2">
                <p className="text-lg mb-6">
                  Somos una empresa peruana con más de 10 años de experiencia,
                  con un sabor ya muy conocido por nuestros clientes. El
                  Sabrosito es mucho más que una pollería. Nuestro primer local
                  abrió en Jr. Alfonso Ugarte - Barranca en el año 2014.
                  Iniciamos con un equipo de 7 trabajadores, incluidos 2
                  horneros, un lavaplatos, un cajero y 3 encargados de atención
                  al público. Desde entonces, hemos seguido expandiéndonos con
                  el apoyo de nuestros clientes.
                </p>
                <p className="text-lg mb-6">
                  Nos sentimos profundamente agradecidos con todos nuestros
                  antiguos y nuevos clientes, quienes nos han permitido seguir
                  adelante con esfuerzo y dedicación, siempre buscando mejorar
                  nuestra atención. Sus sugerencias, comentarios y constantes
                  visitas han sido vitales para nuestro crecimiento.
                </p>
              </div>
              <div className="md:w-1/2 md:pl-8">
                <Image
                  src="/images/Mascota_Tienda.jpg" // Asegúrate de tener una imagen relacionada con la historia del equipo
                  alt="Nuestro equipo"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </section>

          {/* Nuestra Evolución */}
          <section className="mb-12">
            <h2 className="text-4xl font-bold text-yellow-600 mb-6">
              Nuestra Evolución
            </h2>
            <p className="text-lg mb-6">
              Desde nuestro primer local en Barranca, hemos crecido gracias a la
              preferencia de nuestros clientes. No solo hemos ampliado nuestro
              menú, incluyendo una variedad de platos a la carta, chifa y
              parrillas, sino que también nos hemos expandido a nuevas zonas del
              país. Cada paso ha sido dado con el objetivo de mantener nuestra
              calidad, tanto en los productos que ofrecemos como en la atención
              que brindamos.
            </p>
            <p className="text-lg mb-6">
              A lo largo de estos años, hemos invertido en modernizar nuestras
              instalaciones, capacitar a nuestro equipo de trabajo y mejorar la
              experiencia del cliente en cada una de nuestras sucursales.
              Estamos comprometidos a seguir creciendo y llevando el mejor sabor
              a cada rincón del Perú.
            </p>
          </section>

          {/* Agradecimiento a los Clientes */}
          <section>
            <h2 className="text-4xl font-bold text-blue-600 mb-6">
              Agradecimiento a Nuestros Clientes
            </h2>
            <p className="text-lg">
              Nada de esto sería posible sin el apoyo incondicional de nuestros
              clientes. Agradecemos profundamente sus visitas, sus pedidos a
              través de nuestras plataformas de delivery y recojo en tienda, así
              como sus comentarios en persona y en redes sociales. Nos inspiran
              a ser mejores cada día, y seguiremos esforzándonos por ofrecerles
              lo mejor.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
