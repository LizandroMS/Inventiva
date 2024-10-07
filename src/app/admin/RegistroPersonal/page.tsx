"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Branch } from "@prisma/client";
import Footer from "@/components/Footer";
import Header from "@/components/Header_Interno";

// Interfaz para las direcciones
interface Address {
  address: string;
  referencia: string;
  isActive: boolean;
}

export default function RegistroPersonal() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    dni: "",
    birthDate: "",
    role: "cliente", // Valor por defecto "cliente"
    branchId: "", // Sucursal seleccionada (si es personal)
    addresses: [{ address: "", referencia: "", isActive: false }], // Múltiples direcciones
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false); // Estado para manejar el loading
  const [branches, setBranches] = useState<Branch[]>([]); // Para almacenar las sucursales desde la API
  const router = useRouter();

  // Cargar las sucursales cuando se carga el componente
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await fetch("/api/getBranches");
        if (res.ok) {
          const data = await res.json();
          setBranches(data);
        }
      } catch (error) {
        console.error("Error al cargar las sucursales:", error);
      }
    };

    fetchBranches();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number,
    field?: keyof Address
  ) => {
    if (typeof index === "number" && field) {
      // Actualizar una dirección específica
      const newAddresses = [...formData.addresses];
      newAddresses[index] = {
        ...newAddresses[index],
        [field]: e.target.value,
      };
      setFormData({ ...formData, addresses: newAddresses });
    } else {
      // Actualizar otros campos (no direcciones)
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleAddAddress = () => {
    // Agregar una nueva dirección vacía
    setFormData({
      ...formData,
      addresses: [...formData.addresses, { address: "", referencia: "", isActive: false }],
    });
  };

  const handleRemoveAddress = (index: number) => {
    // Eliminar una dirección específica
    const newAddresses = [...formData.addresses];
    newAddresses.splice(index, 1);
    setFormData({ ...formData, addresses: newAddresses });
  };

  const handleSetActiveAddress = (index: number) => {
    // Marcar una dirección como activa y desmarcar el resto
    const newAddresses = formData.addresses.map((addr, idx) => ({
      ...addr,
      isActive: idx === index, // Solo la dirección seleccionada es activa
    }));
    setFormData({ ...formData, addresses: newAddresses });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage(""); // Limpiar mensajes anteriores
    setLoading(true);

    try {
      const res = await fetch("/api/administrador/registerPersonal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Error desconocido");
        setLoading(false);
        return;
      }

      // Si el registro fue exitoso
      const data = await res.json();
      setSuccessMessage(data.message); // Mostrar mensaje de éxito
      setFormData({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        dni: "",
        birthDate: "",
        role: "cliente",
        branchId: "",
        addresses: [{ address: "", referencia: "", isActive: false }], // Reiniciar las direcciones
      });

      setTimeout(() => {
        setLoading(false);
        router.push("/admin"); // Redirigir a la página principal del admin
      }, 2000);
    } catch (error) {
      setError("Ocurrió un error durante el registro");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-8 bg-white">
        <div className="bg-gray-200 p-10 rounded-lg shadow-md w-full max-w-lg mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center text-black">
            Registro de {formData.role === "personal" ? "Personal" : "Usuario"}
          </h1>

          {loading && <p className="text-center text-blue-500 mb-4">Registrando...</p>}
          {error && <p className="text-center text-red-500 mb-4">{error}</p>}
          {successMessage && <p className="text-center text-green-500 mb-4">{successMessage}</p>}

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Nombre Completo</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Ingresa el nombre completo"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingresa el correo electrónico"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Crea una contraseña"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Teléfono</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ingresa el teléfono"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">DNI</label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="Ingresa el DNI"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Fecha de Nacimiento</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
                required
              />
            </div>

            {/* Múltiples direcciones */}
            <h3 className="text-xl font-bold text-gray-700 mb-4">Direcciones</h3>
            {formData.addresses.map((address, index) => (
              <div key={index} className="mb-4 border p-4 rounded-lg bg-gray-50">
                <label className="block text-gray-700">Dirección {index + 1}</label>
                <input
                  type="text"
                  placeholder="Ingresa la dirección"
                  value={address.address}
                  onChange={(e) => handleChange(e, index, "address")}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black bg-white mb-2"
                />
                <label className="block text-gray-700">Referencia {index + 1}</label>
                <input
                  type="text"
                  placeholder="Ingresa la referencia"
                  value={address.referencia}
                  onChange={(e) => handleChange(e, index, "referencia")}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black bg-white mb-2"
                />
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleRemoveAddress(index)}
                    className="text-red-500 hover:underline mt-2"
                  >
                    Eliminar Dirección
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetActiveAddress(index)}
                    className={`text-sm ${address.isActive ? "text-green-500" : "text-gray-500"} hover:underline`}
                  >
                    {address.isActive ? "Dirección Activa" : "Marcar como Activa"}
                  </button>
                </div>
              </div>
            ))}
            <button type="button" onClick={handleAddAddress} className="text-blue-500 hover:underline mb-6">
              Agregar otra dirección
            </button>

            <div>
              <label className="block text-gray-700 font-medium">Rol</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
              >
                <option value="cliente">Usuario</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            {/* Mostrar el campo de selección de sucursal solo si es personal */}
            {formData.role === "personal" && (
              <div>
                <label className="block text-gray-700 font-medium">Sucursal</label>
                <select
                  name="branchId"
                  value={formData.branchId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
                  required={formData.role === "personal"}
                >
                  <option value="">Seleccione una sucursal</option>
                  {branches.map((branchId) => (
                    <option key={branchId.id} value={branchId.id}>
                      {branchId.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="text-center">
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 w-full"
                disabled={loading}
              >
                {loading ? "Registrando..." : "Registrar Personal"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
