"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import WhatsappButton from "@/components/WhatsappButton";

interface Product {
  id: number;
  name: string;
  price: number;
  branchId: number;
  imagenUrl: string;
  quantity: number;
  familia: string;
  promotional_price?: number;
  description: string;
}

interface Branch {
  id: number;
  name: string;
}

interface User {
  fullName: string;
  email: string;
}

const familias = [
  "Pollos a la brasa",
  "Chifa",
  "Platos a la carta",
  "Parrillas",
  "Guarniciones",
  "Bebidas sin alcohol",
  "Bebidas con alcohol",
].map((familia) => familia.toUpperCase());

export default function CartaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [selectedFamilia, setSelectedFamilia] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { addToCart, updateCartItemQuantity, cartItems } = useCart();
  const router = useRouter();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Controlar las cantidades de los productos
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  // Cargar sucursales y usuario autenticado al montar el componente
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await fetch("/api/getBranches");
        if (res.ok) {
          const data: Branch[] = await res.json();
          setBranches(data);
          if (data.length > 0) {
            setSelectedBranch(data[0].id);
          }
        }
      } catch (error) {
        console.error("Error al cargar las sucursales:", error);
      }
    };

    fetchBranches();

    // Cargar usuario autenticado
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error al parsear el usuario del localStorage:", error);
        }
      }
    }
  }, [router]);

  // Actualizar 'selectedFamilia' cuando cambie 'categoria'
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const categoriaParam = params.get("categoria");
      if (categoriaParam) {
        setSelectedFamilia(categoriaParam.toUpperCase());
      }
    }
  }, []);

  // Función para cargar productos según sucursal y familia
  const fetchProducts = useCallback(
    async (branchId: number | null, familia: string) => {
      try {
        const res = await fetch("/api/getProducts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ branchId, familia }),
        });

        const data: Product[] = await res.json();

        if (!res.ok || data.length === 0) {
          setProducts([]);
          setFilteredProducts([]);
          setErrorMessage("No se encontraron productos.");
        } else {
          setProducts(data);
          const filtered = data.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setFilteredProducts(filtered);
          setErrorMessage("");
        }
      } catch (error) {
        console.error("Error al cargar los productos:", error);
        setErrorMessage("Ocurrió un error al cargar los productos.");
        setProducts([]);
        setFilteredProducts([]);
      }
    },
    [searchTerm]
  );

  // Efecto para cargar productos cuando cambian los filtros
  useEffect(() => {
    if (selectedBranch !== null) {
      fetchProducts(selectedBranch, selectedFamilia);
    }
  }, [selectedBranch, selectedFamilia, fetchProducts]);

  // Actualizar productos filtrados cuando cambia el término de búsqueda
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const branchId = e.target.value === "" ? null : parseInt(e.target.value);
    setSelectedBranch(branchId);
  };

  const handleFamiliaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFamilia(e.target.value);
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  };

  const handleAddToCart = (product: Product) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    const quantity = quantities[product.id] || 1;

    const existingCartItem = cartItems.find((item) => item.id === product.id);

    if (existingCartItem) {
      updateCartItemQuantity(product.id, quantity);
    } else {
      addToCart({
        ...product,
        quantity,
        promotional_price: product.promotional_price || product.price,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
    setUser(null);
    router.push("/");
    window.location.reload();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header user={user} handleLogout={handleLogout} cartItems={cartItems} />

      {showLoginPrompt && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-11/12 sm:w-96">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
              ¡Atención!
            </h2>
            <p className="text-gray-700 mb-6 text-center">
              Para aprovechar nuestras promociones online debe de Iniciar
              sesión o registrarse.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4 flex flex-wrap gap-4">
        {/* Buscador */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Buscar producto..."
          className="flex-grow p-3 border rounded-lg focus:outline-none focus:border-yellow-500 text-gray-700"
        />

        {/* Selector de sucursales */}
        <select
          value={selectedBranch !== null ? selectedBranch : ""}
          onChange={handleBranchChange}
          className="w-full sm:w-auto p-3 border rounded-lg focus:outline-none focus:border-yellow-500 text-gray-700"
        >
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>

        {/* Selector de familia */}
        <select
          value={selectedFamilia}
          onChange={handleFamiliaChange}
          className="w-full sm:w-auto p-3 border rounded-lg focus:outline-none focus:border-yellow-500 text-gray-700"
        >
          <option value="">Todas las familias</option>
          {familias.map((familia) => (
            <option key={familia} value={familia}>
              {familia}
            </option>
          ))}
        </select>
      </div>

      <main className="flex-grow">
        <section className="container mx-auto p-4">
          {errorMessage ? (
            <p className="text-center text-gray-700">{errorMessage}</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
                        unoptimized
                      />
                    </div>
                    <h3 className="text-xl font-bold text-center text-gray-800">
                      {product.name}
                    </h3>

                    {/* Mostrar precios */}
                    {product.promotional_price ? (
                      <div className="text-center">
                        <p className="text-lg font-semibold text-green-600">
                          S/ {product.promotional_price.toFixed(2)}
                        </p>
                        <p className="text-lg text-red-500 line-through">
                          S/ {product.price.toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-lg font-semibold text-center text-gray-700">
                        S/ {product.price.toFixed(2)}
                      </p>
                    )}

                    {/* Mostrar descripción */}
                    {product.description && (
                      <p className="text-sm text-center text-gray-600 mt-2">
                        {product.description}
                      </p>
                    )}

                    {/* Selección de cantidad */}
                    <div className="mt-4 flex items-center">
                      <label className="text-sm text-gray-700 mr-2">
                        Cantidad:
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={quantities[product.id] || 1}
                        onChange={(e) => {
                          const value = Math.max(
                            1,
                            parseInt(e.target.value) || 1
                          );
                          handleQuantityChange(product.id, value);
                        }}
                        className="w-16 p-2 border rounded-lg text-gray-700"
                      />
                    </div>

                    {/* Botón para añadir al carrito */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg mt-4"
                    >
                      Añadir al carrito
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center col-span-full text-gray-700">
                  No se encontraron productos.
                </p>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
      <WhatsappButton
        phoneNumber="914931631"
        message="Hola, me gustaría saber más sobre sus productos. 👀"
      />
    </div>
  );
}
