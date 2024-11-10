"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaCheck } from "react-icons/fa";

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
    confirmPassword: "", // Nuevo campo para confirmar la contraseña
    phone: "",
    birthDate: "",
    addresses: [{ address: "", referencia: "", isActive: false }],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      const newAddresses = [...formData.addresses];
      newAddresses[index] = {
        ...newAddresses[index],
        [field]:
          e.target.type === "checkbox" ? e.target.checked : e.target.value,
      };

      if (field === "isActive" && e.target.checked) {
        newAddresses.forEach((address, i) => {
          if (i !== index) address.isActive = false;
        });
      }

      setFormData({ ...formData, addresses: newAddresses });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleAddAddress = () => {
    setFormData({
      ...formData,
      addresses: [
        ...formData.addresses,
        { address: "", referencia: "", isActive: false },
      ],
    });
  };

  const handleRemoveAddress = (index: number) => {
    const newAddresses = [...formData.addresses];
    newAddresses.splice(index, 1);
    setFormData({ ...formData, addresses: newAddresses });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 text-blue-500 hover:text-blue-700 flex items-center"
      >
        <FaArrowLeft className="mr-2" /> Volver a Home
      </button>

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
                <label className="block text-gray-700">Correo Electrónico</label>
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
            <p className="text-center text-black">
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
                <label className="block text-gray-700">Correo Electrónico</label>
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
              <div className="mb-4 relative">
                <label className="block text-gray-700">Confirmar Contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black bg-white"
                />
                {formData.password && formData.password === formData.confirmPassword && (
                  <FaCheck className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500" />
                )}
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

              <div className="mb-6">
                <label className="block text-gray-700">Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black bg-white"
                />
              </div>

              <h3 className="text-xl font-bold text-gray-700 mb-4">Direcciones</h3>
              {formData.addresses.map((address, index) => (
                <div
                  key={index}
                  className="mb-4 border p-4 rounded-lg bg-gray-50"
                >
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
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black bg-white"
                  />
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={address.isActive}
                      onChange={(e) => handleChange(e, index, "isActive")}
                      className="mr-2"
                    />
                    <label className="text-gray-700">Marcar como dirección activa</label>
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

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              >
                Registrarse
              </button>
            </form>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
