"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/pages/api_firebase/firebaseUpload";

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
    estado: "disponible",
    fechaCreacion: new Date().toISOString().split("T")[0], // Fecha actual
    creadoPor: "admin", // Temporalmente estático, puedes cambiarlo según el usuario autenticado
    branchId: "", // Campo para almacenar la sucursal seleccionada
    imagenUrl: "", // Almacena la URL de la imagen subida
  });

  const [branches, setBranches] = useState<Branch[]>([]); // Para almacenar las sucursales
  const [file, setFile] = useState<File | null>(null); // Estado para almacenar el archivo
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false); // Estado para manejar el progreso de la subida
  const router = useRouter();

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      // Subir la imagen a Firebase y obtener la URL de la imagen
      const imageUrl: string = await uploadImage(file); // Tipado correcto
  
      // Realizar la solicitud para registrar el producto junto con la URL de la imagen
      const res = await fetch("/api/registroProductos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, imagenUrl: imageUrl }), // Guardamos la URL de la imagen junto con los datos del producto
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Error desconocido");
        return;
      }
  
      router.push("/admin"); // Redirige de vuelta al admin
    } catch (error) {
      setError("Ocurrió un error al registrar el producto.");
    } finally {
      setUploading(false); // Ocultar indicador de subida
    }
  };
  

  return (
    <div className="container mx-auto p-8 bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Registro de Productos</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-gray-200 p-6 rounded-lg shadow-lg">
        {/* Campos del formulario de registro */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Nombre del Producto</label>
          <input
            type="text"
            name="nombreProducto"
            value={formData.nombreProducto}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
            rows={3}
            required
          ></textarea>
        </div>

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

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Precio Promocional</label>
          <input
            type="number"
            name="precioPromocional"
            value={formData.precioPromocional}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
          />
        </div>

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

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Estado</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
          >
            <option value="disponible">Disponible</option>
            <option value="no disponible">No disponible</option>
          </select>
        </div>

        {/* Selector de sucursales */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Sucursal</label>
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
          <label className="block text-gray-700 font-bold mb-2">Imagen del Producto</label>
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
  );
}
