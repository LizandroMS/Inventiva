"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) return setError("Token no válido o ausente.");

    if (password !== confirmPassword) return setError("Las contraseñas no coinciden.");

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Contraseña actualizada correctamente.");
      setTimeout(() => router.push("/"), 2000);
    } else {
      setError(data.message || "Error al cambiar contraseña.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold text-center mb-4">Cambiar Contraseña</h2>

      <input
        type="password"
        placeholder="Nueva contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded mb-4"
        required
      />
      <input
        type="password"
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded mb-4"
        required
      />
      <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
        Actualizar contraseña
      </button>

      {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </form>
  );
}
