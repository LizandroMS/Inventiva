"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Branch, User } from "@prisma/client";
import Header from "@/components/Header_Interno";
import Footer from "@/components/Footer";

// Interfaz extendida para incluir direcciones
interface Address {
  address: string;
  referencia: string;
  isActive: boolean;
}

interface UserWithAddresses extends User {
  addresses: Address[];
  branch: Branch | null; // Incluimos la sucursal si es personal
}

export default function EditarAccesoPersonal() {
  const [users, setUsers] = useState<UserWithAddresses[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithAddresses | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Cargar usuarios al cargar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/administrador/getAllUsers");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        } else {
          console.error("Error al obtener los usuarios");
        }
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleEditClick = (user: UserWithAddresses) => {
    setSelectedUser(user); // Establecer el usuario seleccionado para edición
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number, field?: keyof Address) => {
    if (typeof index === "number" && field) {
      const updatedAddresses = [...selectedUser!.addresses];
      updatedAddresses[index] = { ...updatedAddresses[index], [field]: e.target.value };
      setSelectedUser({ ...selectedUser!, addresses: updatedAddresses });
    } else {
      setSelectedUser({ ...selectedUser!, [e.target.name]: e.target.value });
    }
  };

  const handleUpdateSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/administrador/updateUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedUser),
      });

      if (res.ok) {
        // Refrescar la lista de usuarios
        const updatedUser = await res.json();
        setUsers((prev) =>
          prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
        setSelectedUser(null); // Cerrar el formulario de edición
      } else {
        console.error("Error al actualizar el usuario");
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-8 bg-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Editar Acceso del Personal</h1>

        {/* Mostrar tabla de usuarios */}
        <table className="table-auto w-full bg-white rounded-lg shadow-lg mb-8">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4">Nombre</th>
              <th className="p-4">Correo</th>
              <th className="p-4">Teléfono</th>
              <th className="p-4">DNI</th>
              <th className="p-4">Rol</th>
              <th className="p-4">Sucursal</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="p-4">{user.fullName}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.phone}</td>
                <td className="p-4">{user.dni}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">{user.branch?.name || "N/A"}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Formulario de edición (si un usuario está seleccionado) */}
        {selectedUser && (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">Nombre Completo</label>
                <input
                  type="text"
                  name="fullName"
                  value={selectedUser.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg text-gray-800"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={selectedUser.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg text-gray-800"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  value={selectedUser.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg text-gray-800"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">DNI</label>
                <input
                  type="text"
                  name="dni"
                  value={selectedUser.dni}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg text-gray-800"
                />
              </div>
              {/* Direcciones */}
              <h3 className="text-lg font-bold mt-6">Direcciones</h3>
              {selectedUser.addresses.map((address, index) => (
                <div key={index} className="mb-4">
                  <input
                    type="text"
                    placeholder="Dirección"
                    value={address.address}
                    onChange={(e) => handleInputChange(e, index, "address")}
                    className="w-full px-4 py-2 mb-2 border rounded-lg text-gray-800"
                  />
                  <input
                    type="text"
                    placeholder="Referencia"
                    value={address.referencia}
                    onChange={(e) => handleInputChange(e, index, "referencia")}
                    className="w-full px-4 py-2 border rounded-lg text-gray-800"
                  />
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <button
                onClick={handleUpdateSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
