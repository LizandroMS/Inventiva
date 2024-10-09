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
  const [selectedUser, setSelectedUser] = useState<UserWithAddresses | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla la visibilidad del modal
  const router = useRouter();
  console.log(router)
  // Cargar usuarios y sucursales al cargar el componente
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

    const fetchBranches = async () => {
      try {
        const res = await fetch("/api/getBranches");
        if (res.ok) {
          const data = await res.json();
          setBranches(data);
        } else {
          console.error("Error al obtener sucursales");
        }
      } catch (error) {
        console.error("Error al obtener sucursales:", error);
      }
    };

    fetchUsers();
    fetchBranches();
  }, []);

  const handleEditClick = (user: UserWithAddresses) => {
    setSelectedUser(user);
    setIsModalOpen(true); // Abrir el modal cuando se haga clic en editar
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number,
    field?: keyof Address
  ) => {
    if (typeof index === "number" && field) {
      const updatedAddresses = [...selectedUser!.addresses];
      updatedAddresses[index] = {
        ...updatedAddresses[index],
        [field]: e.target.value,
      };
      setSelectedUser({ ...selectedUser!, addresses: updatedAddresses });
    } else {
      setSelectedUser({ ...selectedUser!, [e.target.name]: e.target.value });
    }
  };

  const handleAddressActiveChange = (index: number) => {
    const updatedAddresses = selectedUser!.addresses.map((address, i) => ({
      ...address,
      isActive: i === index, // Marcar solo la dirección seleccionada como activa
    }));
    setSelectedUser({ ...selectedUser!, addresses: updatedAddresses });
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
        const updatedUser = await res.json();
        setUsers((prev) =>
          prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
        setSelectedUser(null); // Cerrar el modal
        setIsModalOpen(false); // Cerrar el modal
      } else {
        console.error("Error al actualizar el usuario");
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null); // Limpiar el usuario seleccionado al cerrar el modal
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Header />
      <div className="container mx-auto p-8 bg-white text-black">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          Editar Acceso del Personal
        </h1>

        {/* Mostrar tabla de usuarios */}
        <table className="table-auto w-full bg-white rounded-lg shadow-lg mb-8">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 text-black">Nombre</th>
              <th className="p-4 text-black">Correo</th>
              <th className="p-4 text-black">Teléfono</th>
              <th className="p-4 text-black">DNI</th>
              <th className="p-4 text-black">Rol</th>
              <th className="p-4 text-black">Sucursal</th>
              <th className="p-4 text-black">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="p-4 text-black">{user.fullName}</td>
                <td className="p-4 text-black">{user.email}</td>
                <td className="p-4 text-black">{user.phone}</td>
                <td className="p-4 text-black">{user.dni}</td>
                <td className="p-4 text-black">{user.role}</td>
                <td className="p-4 text-black">{user.branch?.name || "N/A"}</td>
                <td className="p-4 text-black">
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

        {/* Modal para edición */}
        {isModalOpen && selectedUser && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto mx-6 mt-6 mb-6 text-black">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full"
              >
                X
              </button>
              <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={selectedUser.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={selectedUser.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">
                    Teléfono
                  </label>
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
                  <div
                    key={index}
                    className={`mb-4 p-4 rounded-lg ${
                      address.isActive ? "bg-green-200" : "bg-gray-100"
                    }`}
                  >
                    <input
                      type="text"
                      placeholder="Dirección"
                      value={address.address}
                      onChange={(e) =>
                        handleInputChange(e, index, "address")
                      }
                      className="w-full px-4 py-2 mb-2 border rounded-lg text-gray-800"
                    />
                    <input
                      type="text"
                      placeholder="Referencia"
                      value={address.referencia}
                      onChange={(e) =>
                        handleInputChange(e, index, "referencia")
                      }
                      className="w-full px-4 py-2 border rounded-lg text-gray-800"
                    />
                    <div className="mt-2 flex items-center">
                      <input
                        type="checkbox"
                        checked={address.isActive}
                        onChange={() => handleAddressActiveChange(index)}
                        className="mr-2"
                      />
                      <span>Marcar como activa</span>
                    </div>
                  </div>
                ))}
                {/* Seleccionar sucursal si el rol es 'cliente' */}
                {selectedUser.role !== "cliente" && (
                  <div>
                    <label className="block text-gray-700 font-medium">
                      Sucursal
                    </label>
                    <select
                      name="branchId"
                      value={selectedUser.branch?.id || ""}
                      onChange={(e) => {
                        const branchId = parseInt(e.target.value, 10);
                        const branch =
                          branches.find((b) => b.id === branchId) || null;
                        setSelectedUser({ ...selectedUser!, branch });
                      }}
                      className="w-full px-4 py-2 border rounded-lg text-gray-800"
                    >
                      <option value="">Seleccionar sucursal</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
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
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
