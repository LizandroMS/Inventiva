"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadNewImage } from "@/pages/api/api_firebase/firebaseUpload";
import imageCompression from "browser-image-compression"; // Importa la librería para la compresión
import Header from "@/components/Header_Interno";
import Footer from "@/components/Footer";
import { FaCheckCircle } from "react-icons/fa"; // Icono para el check de éxito

const familias = [
  "Pollos a la brasa",
  "Chifa",
  "Platos a la carta",
  "Parrillas",
  "Guarniciones",
  "Bebidas sin alcohol",
  "Bebidas con alcohol",
].map((familia) => familia.toUpperCase());

interface Branch {
  id: number;
  name: string;
}

export default function RegistroProducto() {
  const [formData, setFormData] = useState({
    nombreProducto: "",
    descripcion: "",
    precio: "",
    precioPromocional: "",
    stock: "",
    estado: "Disponible",
    fechaCreacion: new Date().toISOString().split("T")[0], // Fecha actual
    creadoPor: "admin", // Temporalmente estático
    branchId: "", // Sucursal seleccionada
    imagenUrl: "", // URL de la imagen subida
    familia: "", // Familia seleccionada
  });

  const [branches, setBranches] = useState<Branch[]>([]); // Para almacenar las sucursales
  const [file, setFile] = useState<File | null>(null); // Estado para almacenar el archivo
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false); // Estado para manejar el progreso de la subida
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal de éxito
  const router = useRouter();
  console.log(router);
  // Fetch para obtener las sucursales desde la API
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await fetch("/api/getBranches"); // Ruta para obtener sucursales
        if (res.ok) {
          const data = await res.json();
          setBranches(data); // Guardar las sucursales en el estado
        } else {
          setError("Error al cargar las sucursales");
        }
      } catch (error) {
        setError("Ocurrió un error al cargar las sucursales");
      }
    };

    fetchBranches();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]); // Almacena el archivo seleccionado
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Debes seleccionar una imagen.");
      return;
    }

    setUploading(true); // Mostrar indicador de subida

    try {
      // Opciones para la compresión de la imagen
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 500,
        useWebWorker: true,
        fileType: "image/webp",
        initialQuality: 0.6, // Ajusta la calidad (entre 0 y 1)
      };

      // Comprimir la imagen y subirla a Firebase
      const compressedFile = await imageCompression(file, options);
      const imagenUrl: string = await uploadNewImage(compressedFile);

      // Guardar el producto en la base de datos
      const res = await fetch("/api/registroProductos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, imagenUrl: imagenUrl }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Error desconocido");
        return;
      }

      // Abrir el modal de éxito
      setIsModalOpen(true);
    } catch (error) {
      setError("Ocurrió un error al registrar el producto.");
    } finally {
      setUploading(false); // Ocultar indicador de subida
    }
  };

  // Función para cerrar el modal y resetear el formulario
  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({
      nombreProducto: "",
      descripcion: "",
      precio: "",
      precioPromocional: "",
      stock: "",
      estado: "Disponible",
      fechaCreacion: new Date().toISOString().split("T")[0],
      creadoPor: "admin",
      branchId: "",
      imagenUrl: "",
      familia: "",
    });
    setFile(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <div className="container mx-auto p-8 bg-white">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Registro de Productos
        </h1>
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-gray-200 p-6 rounded-lg shadow-lg"
        >
          {/* Nombre del Producto */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Nombre del Producto
            </label>
            <input
              type="text"
              name="nombreProducto"
              value={formData.nombreProducto}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
              required
            />
          </div>

          {/* Descripción */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
              rows={3}
              required
            ></textarea>
          </div>

          {/* Precio */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Precio</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
              required
            />
          </div>

          {/* Precio Promocional */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Precio Promocional
            </label>
            <input
              type="number"
              name="precioPromocional"
              value={formData.precioPromocional}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
            />
          </div>

          {/* Stock */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
              required
            />
          </div>

          {/* Estado */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Estado</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
            >
              <option value="Disponible">Disponible</option>
              <option value="Agotado">Agotado</option>
            </select>
          </div>

          {/* Selector de familia */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Familia
            </label>
            <select
              name="familia"
              value={formData.familia}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
              required
            >
              <option value="">Selecciona una familia</option>
              {familias.map((familia) => (
                <option key={familia} value={familia}>
                  {familia}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de sucursales */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Sucursal
            </label>
            <select
              name="branchId"
              value={formData.branchId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
              required
            >
              <option value="">Selecciona una sucursal</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Campo para seleccionar la imagen */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Imagen del Producto
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
            disabled={uploading}
          >
            {uploading ? "Subiendo Imagen..." : "Registrar Producto"}
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
      </div>

      {/* Modal emergente para indicar éxito */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <FaCheckCircle className="text-6xl text-green-500 animate-pulse mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">¡Producto Guardado!</h2>
            <p className="text-gray-700 mb-4">
              El producto ha sido registrado exitosamente.
            </p>
            <button
              onClick={handleModalClose}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
