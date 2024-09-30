"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  price: string;
  imagenUrl: string;
}

interface User {
  fullName: string;
  email: string;
}

export default function CartaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Cargar productos desde la API
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/getProducts");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          setFilteredProducts(data); // Mostrar todos los productos al inicio
        }
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };

    // Verificar si el usuario está autenticado
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error al parsear el usuario del localStorage:", error);
      }
    }

    fetchProducts();
  }, []);

  // Función para filtrar productos
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(value)
    );
    setFilteredProducts(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-yellow-500 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Pollería Logo"
              width={60}
              height={60}
              className="mr-4"
            />
            <h1 className="text-2xl font-bold">Pollería El Sabrosito</h1>
          </div>

          <div className="flex space-x-4 items-center">
            {user ? (
              <>
                <span className="text-white text-sm">Bienvenido, {user.fullName}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="bg-white text-yellow-500 font-bold py-2 px-4 rounded-lg"
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Buscador */}
      <div className="container mx-auto p-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Buscar producto..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:border-yellow-500"
        />
      </div>

      {/* Lista de productos */}
      <main className="flex-grow">
        <section className="container mx-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center transition-all hover:shadow-xl transform hover:scale-105"
                >
                  <div className="relative w-full h-48 sm:h-56 lg:h-64 mb-4">
                    <Image
                      src={product.imagenUrl || "/images/default.png"}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-center text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-lg font-semibold text-center text-gray-700">
                    {product.price}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center col-span-4 text-gray-700">
                No se encontraron productos.
              </p>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-green-700 text-white py-4 text-center">
        <p>© 2024 Pollería El Sabrosito. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
