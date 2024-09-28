"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistroPersonal() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    dni: "",
    birthDate: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carga
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Activar el estado de carga cuando se inicie el registro

    try {
      const res = await fetch("/api/registerPersonal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          role: "personal", // Seteamos el rol como "personal"
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Error desconocido");
        setLoading(false); // Desactivar la carga si hay error
        return;
      }

      router.push("/admin"); // Redirigir de vuelta al panel de administración
    } catch (error) {
      setError("Ocurrió un error durante el registro");
      setLoading(false); // Desactivar la carga si hay error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Registrar Personal</h2>
        
        {loading ? ( // Mostrar indicador de carga mientras loading es true
          <div className="text-center">
            <p className="text-blue-500">Registrando...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Campos del formulario */}
            <div className="mb-4">
              <label className="block text-gray-700">Nombre Completo</label>
              <input
                type="text"
                name="fullName"
                placeholder="Ingresa el nombre completo"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Otros campos como email, password, etc */}
            <div className="mb-6">
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              >
                Registrar Personal
              </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
