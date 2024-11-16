"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header_Interno";
import Footer from "@/components/Footer";
import imageCompression from "browser-image-compression"; // Para la compresión de imágenes
import { replaceImage } from "@/pages/api/api_firebase/firebaseUpload"; // Función para reemplazar imagen en Firebase

const familias = [
  "Pollos a la brasa",
  "Chifa",
  "Platos a la carta",
  "Parrillas",
  "Guarniciones",
  "Bebidas sin alcohol",
  "Bebidas con alcohol",
].map((familia) => familia.toUpperCase());

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  promotional_price: number | null;
  stock: number;
  status: string;
  familia: string;
  branchId: number;
  imagenUrl?: string;
}

interface Branch {
  id: number;
  name: string;
}

export default function EditarProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]); // Cargar las sucursales
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null); // Para el archivo de imagen
  const router = useRouter();
  console.log(router);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `/api/administrador/productslist?page=${page}`
        );
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        setErrorMessage("Error al obtener los productos.");
      } finally {
        setLoading(false);
      }
    };

    const fetchBranches = async () => {
      try {
        const response = await fetch(`/api/getBranches`); // Endpoint para obtener las sucursales
        const data = await response.json();
        setBranches(data);
      } catch (error) {
        console.error("Error al obtener las sucursales:", error);
      }
    };

    fetchProducts();
    fetchBranches();
  }, [page]);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setEditingProduct(product); // Establecer el producto a editar
    setIsModalOpen(true); // Abrir el modal
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]); // Guardar el archivo de imagen
    }
  };

  const handleSave = async () => {
    if (!editingProduct) return;

    try {
      let imagenUrl = editingProduct.imagenUrl;

      // Si se seleccionó una nueva imagen, comprimirla y reemplazarla
      if (file) {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 500,
          useWebWorker: true,
          fileType: "image/webp",
          initialQuality: 0.6,
        };

        // Comprimir la imagen seleccionada a WebP
        const compressedFile = await imageCompression(file, options);

        // Reemplazar la imagen existente en Firebase y obtener la nueva URL
        imagenUrl = await replaceImage(
          compressedFile,
          editingProduct.imagenUrl
        );
      }

      // Actualizar el producto con la nueva imagen (si la hay) y los demás datos
      const response = await fetch(`/api/administrador/productsedit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editingProduct,
          imagenUrl: imagenUrl || editingProduct.imagenUrl, // Si no se seleccionó una imagen nueva, mantener la existente
        }),
      });

      if (response.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
        );
        setSelectedProduct(null);
        setIsModalOpen(false); // Cerrar el modal
      } else {
        setErrorMessage("Error al actualizar el producto.");
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      setErrorMessage("Error al actualizar el producto.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setEditingProduct(null);
    setFile(null); // Reiniciar el archivo de imagen
  };

  if (loading) {
    return <p className="text-center text-gray-600">Cargando...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="container mx-auto p-8 flex-grow">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
          Editar Productos
        </h1>

        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        {/* Tabla de productos */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 text-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border-b">ID</th>
                <th className="py-3 px-4 border-b">Nombre</th>
                <th className="py-3 px-4 border-b">Precio</th>
                <th className="py-3 px-4 border-b">Promoción</th>
                <th className="py-3 px-4 border-b">Stock</th>
                <th className="py-3 px-4 border-b">Estado</th>
                <th className="py-3 px-4 border-b">Familia</th>
                <th className="py-3 px-4 border-b">Branch</th>{" "}
                {/* Nueva columna para Branch */}
                <th className="py-3 px-4 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-all"
                >
                  <td className="py-2 px-4 border-b">{product.id}</td>
                  <td className="py-2 px-4 border-b">{product.name}</td>
                  <td className="py-2 px-4 border-b">S/ {product.price}</td>
                  <td className="py-2 px-4 border-b">
                    {product.promotional_price
                      ? `S/ ${product.promotional_price}`
                      : "No"}
                  </td>
                  <td className="py-2 px-4 border-b">{product.stock}</td>
                  <td className="py-2 px-4 border-b">{product.status}</td>
                  <td className="py-2 px-4 border-b">{product.familia}</td>
                  <td className="py-2 px-4 border-b">
                    {branches.find((branch) => branch.id === product.branchId)
                      ?.name || "Sin branch"}
                  </td>{" "}
                  {/* Mostrar el nombre de la Branch */}
                  <td className="py-2 px-4 border-b space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Anterior
          </button>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Siguiente
          </button>
        </div>

        {/* Modal de edición */}
        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 text-gray-700">
                Editar Producto #{selectedProduct.id}
              </h2>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editingProduct?.name || ""}
                  onChange={(e) =>
                    setEditingProduct((prev) =>
                      prev ? { ...prev, name: e.target.value } : prev
                    )
                  }
                  className="w-full p-3 border rounded-lg text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Descripcion
                </label>
                <input
                  type="text"
                  value={editingProduct?.description || ""}
                  onChange={(e) =>
                    setEditingProduct((prev) =>
                      prev ? { ...prev, name: e.target.value } : prev
                    )
                  }
                  className="w-full p-3 border rounded-lg text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Precio
                </label>
                <input
                  type="number"
                  value={editingProduct?.price || 0}
                  onChange={(e) =>
                    setEditingProduct((prev) =>
                      prev
                        ? { ...prev, price: parseFloat(e.target.value) }
                        : prev
                    )
                  }
                  className="w-full p-3 border rounded-lg text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Precio Promocional
                </label>
                <input
                  type="number"
                  value={editingProduct?.promotional_price || 0}
                  onChange={(e) =>
                    setEditingProduct((prev) =>
                      prev
                        ? {
                            ...prev,
                            promotional_price: parseFloat(e.target.value),
                          }
                        : prev
                    )
                  }
                  className="w-full p-3 border rounded-lg text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  value={editingProduct?.stock || 0}
                  onChange={(e) =>
                    setEditingProduct((prev) =>
                      prev
                        ? { ...prev, stock: parseInt(e.target.value, 10) }
                        : prev
                    )
                  }
                  className="w-full p-3 border rounded-lg text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Estado
                </label>
                <select
                  value={editingProduct?.status || ""}
                  onChange={(e) =>
                    setEditingProduct((prev) =>
                      prev ? { ...prev, status: e.target.value } : prev
                    )
                  }
                  className="w-full p-3 border rounded-lg text-black"
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Agotado">Agotado</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Familia
                </label>
                <select
                  value={editingProduct?.familia || ""}
                  onChange={(e) =>
                    setEditingProduct((prev) =>
                      prev ? { ...prev, familia: e.target.value } : prev
                    )
                  }
                  className="w-full p-3 border rounded-lg text-black"
                >
                  {familias.map((familia) => (
                    <option key={familia} value={familia}>
                      {familia}
                    </option>
                  ))}
                </select>
              </div>

              {/* Añadir campo para seleccionar la imagen */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Imagen del Producto
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 border rounded-lg text-black"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Branch
                </label>
                <select
                  value={editingProduct?.branchId || ""}
                  onChange={(e) =>
                    setEditingProduct((prev) =>
                      prev
                        ? { ...prev, branchId: parseInt(e.target.value) }
                        : prev
                    )
                  }
                  className="w-full p-3 border rounded-lg text-black"
                >
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={closeModal}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
