"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";

interface Product {
  id: number;
  name: string;
  price: number;
  imagenUrl: string;
  branchId: number;
}

interface Branch {
  id: number;
  name: string;
}

interface User {
  fullName: string;
  email: string;
}

export default function CartaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number | "">("");
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const { addToCart, cartItems } = useCart();
  console.log(products);
  useEffect(() => {
    // Cargar sucursales
    const fetchBranches = async () => {
      try {
        const res = await fetch("/api/getBranches");
        if (res.ok) {
          const data: Branch[] = await res.json();
          setBranches(data);
          if (data.length > 0) {
            setSelectedBranch(data[0].id); // Selecciona la primera sucursal por defecto
          }
        }
      } catch (error) {
        console.error("Error al cargar las sucursales:", error);
      }
    };

    fetchBranches();

    // Cargar usuario autenticado
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error al parsear el usuario del localStorage:", error);
      }
    }
  }, []);

  // Función para cargar productos por sucursal
  const fetchProducts = useCallback(
    async (branchId: number | "") => {
      try {
        const res = await fetch("/api/getProducts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ branchId }),
        });
        if (res.ok) {
          const data: Product[] = await res.json();
          setProducts(data);
          filterProducts(data, searchTerm, branchId); // Aplicar el filtro cuando se obtienen los productos
        }
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    },
    [searchTerm]
  );

  // Función para filtrar los productos según el término de búsqueda y la sucursal seleccionada
  const filterProducts = (
    productList: Product[],
    searchTerm: string,
    branchId: number | ""
  ) => {
    const filtered = productList.filter((product) => {
      const matchesBranch = branchId === "" || product.branchId === branchId;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm);
      return matchesBranch && matchesSearch;
    });
    setFilteredProducts(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const branchId = e.target.value === "" ? "" : parseInt(e.target.value);
    setSelectedBranch(branchId);
  };

  // Función para ejecutar la búsqueda manual cuando se da clic en el botón "Buscar"
  const handleSearchClick = () => {
    fetchProducts(selectedBranch); // Llamamos a la API para obtener productos basados en la sucursal seleccionada
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header
        user={user}
        handleLogout={() => setUser(null)}
        cartItems={cartItems}
      />

      <div className="container mx-auto p-4 flex space-x-4">
        {/* Buscador */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Buscar producto..."
          className="w-3/5 p-3 border rounded-lg focus:outline-none focus:border-yellow-500 text-gray-700"
        />

        {/* Selector de sucursales */}
        <select
          value={selectedBranch}
          onChange={handleBranchChange}
          className="w-1/5 p-3 border rounded-lg focus:outline-none focus:border-yellow-500 text-gray-700"
        >
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>

        {/* Botón Buscar */}
        <button
          onClick={handleSearchClick}
          className="w-1/5 bg-yellow-500 hover:bg-yellow-600 text-gray-700 font-bold py-2 px-4 rounded-lg"
        >
          Buscar
        </button>
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
                    S/ {product.price.toFixed(2)}
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
