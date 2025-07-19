import React, { useState, useEffect } from "react";

export default function FormularioPropiedad({ propiedadInicial = {}, onSubmit }) {
  const [titulo, setTitulo] = useState(propiedadInicial.titulo || "");
  const [descripcion, setDescripcion] = useState(propiedadInicial.descripcion || "");
  const [ciudad, setCiudad] = useState(propiedadInicial.ciudad || "");
  const [precioAlquiler, setPrecioAlquiler] = useState(propiedadInicial.precio_alquiler || "");
  const [tipoUsuario, setTipoUsuario] = useState(propiedadInicial.tipo_usuario || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar campos básicos
    if (!titulo || !ciudad || !precioAlquiler || !tipoUsuario) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    const propiedadData = {
      titulo,
      descripcion,
      ciudad,
      precio_alquiler: parseFloat(precioAlquiler),
      tipo_usuario: tipoUsuario,
    };

    onSubmit(propiedadData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md p-6 mx-auto space-y-4 bg-white rounded-md shadow"
    >
      <h2 className="text-xl font-semibold">Formulario de Propiedad</h2>

      <input
        type="text"
        placeholder="Título *"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
      />

      <input
        type="text"
        placeholder="Ciudad *"
        value={ciudad}
        onChange={(e) => setCiudad(e.target.value)}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="number"
        placeholder="Precio de alquiler *"
        min="0"
        value={precioAlquiler}
        onChange={(e) => setPrecioAlquiler(e.target.value)}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        value={tipoUsuario}
        onChange={(e) => setTipoUsuario(e.target.value)}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Seleccionar tipo de usuario *</option>
        <option value="dueño">Dueño directo</option>
        <option value="inmobiliaria">Inmobiliaria</option>
      </select>

      <button
        type="submit"
        className="w-full py-3 font-semibold text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Guardar
      </button>
    </form>
  );
}
