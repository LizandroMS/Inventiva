"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";


// Definir la interfaz del producto
export interface Product {
  id: number;
  name: string;
  price: number;
  branchId: number;
  imagenUrl: string;
  quantity: number;
  familia: string;
  promotional_price?: number; // Hacer que sea opcional
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
  const [selectedBranch, setSelectedBranch] = useState<number | "">("");
  const [selectedFamilia, setSelectedFamilia] = useState<string>(""); // Nueva variable para familia
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState(""); // Para manejar el mensaje de error
  const { addToCart, updateCartItemQuantity, cartItems } = useCart(); // Añadido `updateCartItemQuantity`
  const router = useRouter();
  console.log(products);
  // Para controlar la cantidad de productos
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

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
    } else {
      router.push("/login");
    }
  }, []);

  // Función para cargar productos por sucursal y familia
  const fetchProducts = useCallback(
    async (branchId: number | "", familia: string) => {
      try {
        const res = await fetch("/api/getProducts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ branchId, familia }), // Enviar familia al backend
        });

        const data = await res.json();

        if (!res.ok || data.message) {
          // Si la respuesta no es correcta o contiene un mensaje, limpiar la vista y mostrar error
          setProducts([]);
          setFilteredProducts([]);
          setErrorMessage(data.message || "No se encontraron productos.");
        } else {
          setProducts(data);
          filterProducts(data, searchTerm, branchId, familia); // Aplicar el filtro cuando se obtienen los productos
          setErrorMessage(""); // Limpiar el mensaje de error si se encuentran productos
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

  // Función para filtrar los productos según el término de búsqueda, la sucursal y la familia seleccionada
  const filterProducts = (
    productList: Product[],
    searchTerm: string,
    branchId: number | "",
    familia: string
  ) => {
    const filtered = productList.filter((product) => {
      const matchesBranch = branchId === "" || product.branchId === branchId;
      const matchesFamilia = familia === "" || product.familia === familia;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm);
      return matchesBranch && matchesFamilia && matchesSearch;
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

  const handleFamiliaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFamilia(e.target.value);
  };

  // Función para cambiar la cantidad de productos seleccionados
  const handleQuantityChange = (productId: number, quantity: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  };

  // Función para ejecutar la búsqueda manual cuando se da clic en el botón "Buscar"
  const handleSearchClick = () => {
    fetchProducts(selectedBranch, selectedFamilia); // Llamamos a la API para obtener productos basados en la sucursal y la familia seleccionada
  };

  // Función para agregar o actualizar la cantidad del producto en el carrito
  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
  
    // Verificar si el producto ya está en el carrito
    const existingCartItem = cartItems.find((item) => item.id === product.id);
  
    if (existingCartItem) {
      // Actualizar la cantidad si el producto ya está en el carrito
      updateCartItemQuantity(product.id, quantity);
    } else {
      // Asegurarse de que promotional_price siempre tenga un valor
      addToCart({
        ...product,
        quantity,
        promotional_price: product.promotional_price || product.price, // Si no hay promotional_price, usar el precio regular
      });
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem("user"); // Limpiar datos del usuario
    setUser(null); // Limpiar el estado del usuario
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header user={user} handleLogout={handleLogout} cartItems={cartItems} />
      <div className="container mx-auto p-4 flex space-x-4">
        {/* Buscador */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Buscar producto..."
          className="w-3/6 p-3 border rounded-lg focus:outline-none focus:border-yellow-500 text-gray-700"
        />

        {/* Selector de sucursales */}
        <select
          value={selectedBranch}
          onChange={handleBranchChange}
          className="w-1/6 p-3 border rounded-lg focus:outline-none focus:border-yellow-500 text-gray-700"
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
          className="w-1/6 p-3 border rounded-lg focus:outline-none focus:border-yellow-500 text-gray-700"
        >
          <option value="">Todas las familias</option>
          {familias.map((familia) => (
            <option key={familia} value={familia}>
              {familia}
            </option>
          ))}
        </select>

        {/* Botón Buscar */}
        <button
          onClick={handleSearchClick}
          className="w-1/6 bg-yellow-500 hover:bg-yellow-600 text-gray-700 font-bold py-2 px-4 rounded-lg"
        >
          Buscar
        </button>
      </div>

      <main className="flex-grow">
        <section className="container mx-auto p-4">
          {errorMessage ? (
            <p className="text-center col-span-4 text-gray-700">
              {errorMessage}
            </p>
          ) : (
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

                    {/* Mostrar observación */}
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
                        onChange={(e) =>
                          handleQuantityChange(
                            product.id,
                            parseInt(e.target.value)
                          )
                        }
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
                <p className="text-center col-span-4 text-gray-700">
                  No se encontraron productos.
                </p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
