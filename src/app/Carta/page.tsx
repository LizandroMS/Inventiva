"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
//import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface Product {
  id: number;
  name: string;
  price: string;
  imagenUrl: string;
}

export default function CartaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
 // const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/getProducts");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          setFilteredProducts(data);
        }
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(value)
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Buscar producto..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:border-yellow-500"
        />
      </div>

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
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg mt-4"
                  >
                    Añadir al carrito
                  </button>
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
    </div>
  );
}
