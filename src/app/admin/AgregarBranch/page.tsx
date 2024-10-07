// src/pages/admin/AgregarBranch.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header_Interno"; // Importa tu Header
import Footer from "@/components/Footer"; // Importa tu Footer

export default function AgregarBranch() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleSave = async () => {
    if (!name || !address || !phone) {
      setErrorMessage("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await fetch("/api/administrador/branch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          address,
          phone,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Sucursal guardada con éxito.");
        setErrorMessage("");
        setName("");
        setAddress("");
        setPhone("");
        setTimeout(() => {
          router.push("/admin"); // Redirigir después de 2 segundos
        }, 2000);
      } else {
        setErrorMessage("Error al guardar la sucursal.");
      }
    } catch (error) {
      console.error("Error al guardar la sucursal:", error);
      setErrorMessage("Error al guardar la sucursal.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header /> {/* Header reutilizable */}

      <div className="container mx-auto p-8 flex-grow">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Agregar Nueva Sucursal</h1>

        <div className="max-w-lg mx-auto bg-white shadow-md p-6 rounded-lg">
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Nombre de la Sucursal</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
              placeholder="Ej. Sucursal Lima"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Dirección</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
              placeholder="Ej. Av. Principal 123, Lima"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Teléfono</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
              placeholder="Ej. 999 888 777"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Guardar Sucursal
          </button>
        </div>
      </div>

      <Footer /> {/* Footer reutilizable */}
    </div>
  );
}
