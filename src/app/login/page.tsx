"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
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
  const [loading, setLoading] = useState(false); // Estado para manejar el loading
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpiar cualquier error anterior
    setLoading(true); // Activar el estado de loading

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
        setLoading(false); // Desactivar loading si hay error
        return;
      }

      // Si el registro fue exitoso
      const user = await res.json();
      localStorage.setItem("user", JSON.stringify(user)); // Guardar datos del usuario

      // Retrasar la redirección para mostrar el loading durante 1 segundo
      setTimeout(() => {
        setLoading(false); // Desactivar el loading
        router.push("/"); // Redirigir a la página de inicio
      }, 1000); // Retraso de 1 segundo
    } catch (error) {
      setError("Ocurrió un error durante el registro");
      setLoading(false); // Desactivar loading si hay error
    }
  };
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Limpiar cualquier error anterior
    setLoading(true); // Activar el estado de loading

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Error desconocido');
        setLoading(false); // Desactivar loading si hay error
        return;
      }

      // Si el login fue exitoso
      const user = await res.json();
      localStorage.setItem('user', JSON.stringify(user)); // Guardar datos del usuario

      // Retrasar la redirección para mostrar el loading durante 1 segundo
      setTimeout(() => {
        setLoading(false); // Desactivar el loading
        router.push('/');  // Redirigir a la página de inicio
      }, 1000);  // Retraso de 1 segundo

    } catch (error) {
      setError('Ocurrió un error durante el inicio de sesión');
      setLoading(false); // Desactivar loading si hay error
    }
  };


  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-48">
            <div className="spinner mb-4"></div> {/* Spinner personalizado */}
            <p className="text-xl font-bold text-blue-500 text-black">
              Registrando...
            </p>
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
                onClick={toggleForm}
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
              {/* Nombre completo */}
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

              {/* Otros campos */}
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

              {/* Contraseña */}
              <div className="mb-4">
                <label className="block text-gray-700">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Crea una contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black bg-white"
                />
              </div>

              {/* Dirección */}
              <div className="mb-4">
                <label className="block text-gray-700">Dirección</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Ingresa tu dirección"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black bg-white"
                />
              </div>

              {/* Teléfono */}
              <div className="mb-4">
                <label className="block text-gray-700">Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Ingresa tu teléfono"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black bg-white"
                />
              </div>

              {/* DNI */}
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

              {/* Fecha de nacimiento */}
              <div className="mb-4">
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
                onClick={toggleForm}
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
