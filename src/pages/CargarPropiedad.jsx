import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const ModalRegistrarPropiedad = ({ isOpen, onClose, onPropiedadAgregada }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    ubicacion: "",
    precio: "",
    tipo: "departamento",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.from("propiedades").insert([formData]);

    if (error) {
      console.error("Error al registrar propiedad:", error);
    } else {
      console.log("Propiedad registrada con éxito:", data);
      onPropiedadAgregada();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 text-black bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-2xl font-bold">Registrar Propiedad</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="titulo"
            placeholder="Título"
            value={formData.titulo}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-md placeholder:text-gray-600"
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-md placeholder:text-gray-600"
          />
          <input
            type="text"
            name="ubicacion"
            placeholder="Ubicación"
            value={formData.ubicacion}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-md placeholder:text-gray-600"
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={formData.precio}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-md placeholder:text-gray-600"
          />
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-md"
          >
            <option value="departamento">Departamento</option>
            <option value="casa">Casa</option>
            <option value="duplex">Dúplex</option>
            <option value="otro">Otro</option>
          </select>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRegistrarPropiedad;
