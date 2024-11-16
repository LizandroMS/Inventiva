"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header_Interno";
import Footer from "@/components/Footer";

interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  schedules: { day: string; startTime: string; endTime: string }[];
}

export default function GestionarSucursales() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchId, setBranchId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [schedules, setSchedules] = useState([
    { day: "Lunes", startTime: "", endTime: "" },
    { day: "Martes", startTime: "", endTime: "" },
    { day: "Miércoles", startTime: "", endTime: "" },
    { day: "Jueves", startTime: "", endTime: "" },
    { day: "Viernes", startTime: "", endTime: "" },
    { day: "Sábado", startTime: "", endTime: "" },
    { day: "Domingo", startTime: "", endTime: "" },
  ]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  console.log(successMessage, router);
  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/administrador/getbranches");
      if (response.ok) {
        const data = await response.json();
        setBranches(data);
      } else {
        setErrorMessage("Error al cargar las sucursales.");
      }
    } catch (error) {
      console.error("Error al cargar las sucursales:", error);
      setErrorMessage("Error al cargar las sucursales.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name || !address || !phone) {
      setErrorMessage("Todos los campos son obligatorios.");
      return;
    }

    if (
      schedules.some((schedule) => !schedule.startTime || !schedule.endTime)
    ) {
      setErrorMessage("Completa los horarios de todos los días.");
      return;
    }

    try {
      const method = branchId ? "PUT" : "POST";
      const url = branchId
        ? `/api/administrador/createbranch/${branchId}`
        : "/api/administrador/createbranch";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, address, phone, schedules }),
      });

      if (response.ok) {
        setSuccessMessage(
          branchId
            ? "Sucursal actualizada con éxito."
            : "Sucursal creada con éxito."
        );
        setErrorMessage("");
        resetForm();
        setIsModalOpen(false);
        fetchBranches();
      } else {
        setErrorMessage(
          branchId
            ? "Error al actualizar la sucursal."
            : "Error al guardar la sucursal."
        );
      }
    } catch (error) {
      console.error(
        branchId
          ? "Error al actualizar la sucursal:"
          : "Error al guardar la sucursal:",
        error
      );
      setErrorMessage(
        branchId
          ? "Error al actualizar la sucursal."
          : "Error al guardar la sucursal."
      );
    }
  };

  const handleEdit = (branch: Branch) => {
    setBranchId(branch.id);
    setName(branch.name);
    setAddress(branch.address);
    setPhone(branch.phone);
    setSchedules(branch.schedules);
    setErrorMessage("");
    setSuccessMessage("");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/administrador/branch/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccessMessage("Sucursal eliminada con éxito.");
        fetchBranches();
      } else {
        setErrorMessage("Error al eliminar la sucursal.");
      }
    } catch (error) {
      console.error("Error al eliminar la sucursal:", error);
      setErrorMessage("Error al eliminar la sucursal.");
    }
  };

  const resetForm = () => {
    setBranchId(null);
    setName("");
    setAddress("");
    setPhone("");
    setSchedules(
      schedules.map((schedule) => ({
        ...schedule,
        startTime: "",
        endTime: "",
      }))
    );
  };

  const handleScheduleChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index] = { ...updatedSchedules[index], [field]: value };
    setSchedules(updatedSchedules);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <div className="container mx-auto p-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Gestión de Sucursales
          </h1>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Agregar Sucursal
          </button>
        </div>

        {loading ? (
          <p className="text-center">Cargando...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border border-gray-300">Nombre</th>
                  <th className="px-4 py-2 border border-gray-300">
                    Dirección
                  </th>
                  <th className="px-4 py-2 border border-gray-300">Teléfono</th>
                  <th className="px-4 py-2 border border-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border border-gray-300">
                      {branch.name}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {branch.address}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {branch.phone}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 flex gap-2">
                      <button
                        onClick={() => handleEdit(branch)}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-lg"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(branch.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className="bg-white rounded-lg shadow-lg max-w-lg w-full overflow-y-auto p-6"
            style={{ height: "90%" }}
          >
            <h2 className="text-xl font-bold mb-4">
              {branchId ? "Editar Sucursal" : "Agregar Sucursal"}
            </h2>
            {errorMessage && (
              <p className="text-red-500 mb-4">{errorMessage}</p>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Nombre de la Sucursal
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Ej. Sucursal Lima"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Dirección
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Ej. Av. Principal 123, Lima"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Teléfono
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Ej. 999 888 777"
              />
            </div>
            <h3 className="text-lg font-semibold mb-4">Horarios de Atención</h3>
            {schedules.map((schedule, index) => (
              <div key={index} className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  {schedule.day}
                </label>
                <div className="flex gap-4">
                  <input
                    type="time"
                    value={schedule.startTime}
                    onChange={(e) =>
                      handleScheduleChange(index, "startTime", e.target.value)
                    }
                    className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  <input
                    type="time"
                    value={schedule.endTime}
                    onChange={(e) =>
                      handleScheduleChange(index, "endTime", e.target.value)
                    }
                    className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                {branchId ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
