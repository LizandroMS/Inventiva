"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


interface Address {
  address: string;
  referencia: string;
  isActive: boolean;
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    dni: "",
    birthDate: "",
    addresses: [{ address: "", referencia: "", isActive: false }], 
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Validar si el usuario ya está logueado y redirigirlo
  useEffect(() => {
    const token = localStorage.getItem("user");

    if (token) {
      const rol = JSON.parse(token);
      if (rol.role === "cliente") {
        router.push("/");
      } else if (rol.role === "personal") {
        router.push("/personal");
      } else if (rol.role === "admin") {
        router.push("/admin");
      }
    }
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number,
    field?: keyof Address
  ) => {
    if (typeof index === "number" && field) {
      // Actualizar una dirección específica
      const newAddresses = [...formData.addresses];
      newAddresses[index] = {
        ...newAddresses[index],
        [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
      };

      // Si se marca una dirección como activa, desactivar las demás
      if (field === "isActive" && e.target.checked) {
        newAddresses.forEach((address, i) => {
          if (i !== index) address.isActive = false;
        });
      }

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

  // Manejo del registro de usuario
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
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
      const user = await res.json();
      localStorage.setItem("user", JSON.stringify(user));

      setTimeout(() => {
        setLoading(false);
        router.push("/");
      }, 1000);
    } catch (error) {
      setError("Ocurrió un error durante el registro");
      setLoading(false);
    }
  };

  // Manejo del inicio de sesión de usuario
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
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

      // Si el login fue exitoso
      const user = await res.json();

      if (user.token) {
        localStorage.setItem("userToken", user.token);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        throw new Error("Token no encontrado en la respuesta.");
      }

      setTimeout(() => {
        setLoading(false);
        if (user.role === "cliente") {
          router.push("/");
        } else if (user.role === "personal") {
          router.push("/personal");
        } else if (user.role === "admin") {
          router.push("/admin");
        }
      }, 1000);
    } catch (error) {
      setError("Ocurrió un error durante el inicio de sesión");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-48">
            <div className="spinner mb-4"></div>
            <p className="text-xl font-bold text-blue-500">Cargando...</p>
          </div>
        ) : isLogin ? (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center text-black">
              Iniciar Sesión
            </h2>
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Ingresa tu correo"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black bg-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Ingresa tu contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black bg-white"
                />
              </div>
              <div className="mb-6">
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                  Iniciar Sesión
                </button>
              </div>
            </form>
            {error && <p className="text-red-500">{error}</p>}
            <p className="text-center">
              ¿No tienes una cuenta?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-500 hover:underline"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center text-black">
              Registro
            </h2>
            <form onSubmit={handleRegisterSubmit}>
              {/* Formulario de registro */}
              <div className="mb-4">
                <label className="block text-gray-700">Nombre Completo</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Ingresa tu nombre completo"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black bg-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Ingresa tu correo"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black bg-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Ingresa tu contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black bg-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Teléfono</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Ingresa tu teléfono"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black bg-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">DNI</label>
                <input
                  type="text"
                  name="dni"
                  placeholder="Ingresa tu DNI"
                  value={formData.dni}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black bg-white"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black bg-white"
                />
              </div>

              {/* Múltiples direcciones */}
              <h3 className="text-xl font-bold text-gray-700 mb-4">
                Direcciones
              </h3>
              {formData.addresses.map((address, index) => (
                <div
                  key={index}
                  className="mb-4 border p-4 rounded-lg bg-gray-50"
                >
                  <label className="block text-gray-700">
                    Dirección {index + 1}
                  </label>
                  <input
                    type="text"
                    name={`address_${index}`}
                    placeholder="Ingresa la dirección"
                    value={address.address}
                    onChange={(e) => handleChange(e, index, "address")}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black bg-white mb-2"
                  />
                  <label className="block text-gray-700">
                    Referencia {index + 1}
                  </label>
                  <input
                    type="text"
                    name={`referencia_${index}`}
                    placeholder="Ingresa la referencia"
                    value={address.referencia}
                    onChange={(e) => handleChange(e, index, "referencia")}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black bg-white"
                  />

                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={address.isActive}
                      onChange={(e) => handleChange(e, index, "isActive")}
                      className="mr-2"
                    />
                    <label className="text-gray-700">
                      Marcar como dirección activa
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveAddress(index)}
                    className="text-red-500 hover:underline mt-2"
                  >
                    Eliminar Dirección
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddAddress}
                className="text-blue-500 hover:underline mb-6"
              >
                Agregar otra dirección
              </button>

              <div className="mb-6">
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                >
                  Registrarse
                </button>
              </div>
              {error && <p className="text-red-500">{error}</p>}
            </form>
            <p className="text-center">
              ¿Ya tienes una cuenta?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-500 hover:underline"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
