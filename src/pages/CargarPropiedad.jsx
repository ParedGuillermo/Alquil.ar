import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ModalRegistrarPropiedad({ onClose, usuarioId, onPropiedadAgregada }) {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    precio_mensual: "",
    tipo_alquiler: "permanente", // permanente o temporal
    habitaciones: 1,
    provincia: "",
    ciudad: "",
    contrato_incluido: false,
    disponible: true,
    tipo_publicacion: "dueño directo", // dueño directo o inmobiliaria
    amueblado: false, // <-- agregado
    imagen: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, imagen: files[0] }));
    } else if (type === "number") {
      setForm((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imagen_url = null;

      if (form.imagen) {
        const fileName = `propiedades/${Date.now()}_${form.imagen.name}`;
        const { error: uploadError } = await supabase.storage
          .from("propiedades")
          .upload(fileName, form.imagen);

        if (uploadError) {
          throw new Error("Error al subir imagen: " + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from("propiedades")
          .getPublicUrl(fileName);

        imagen_url = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("propiedades").insert({
        titulo: form.titulo.trim(),
        descripcion: form.descripcion?.trim() || null,
        precio_mensual: parseFloat(form.precio_mensual) || 0,
        tipo_alquiler: form.tipo_alquiler,
        habitaciones: form.habitaciones,
        provincia: form.provincia.trim(),
        ciudad: form.ciudad.trim(),
        contrato_incluido: form.contrato_incluido,
        disponible: form.disponible,
        tipo_publicacion: form.tipo_publicacion,
        amueblado: form.amueblado, // <-- guardo amueblado
        imagen_url,
        propietario_id: usuarioId,
      });

      if (insertError) {
        throw new Error("Error al guardar la propiedad: " + insertError.message);
      }

      if (onPropiedadAgregada) onPropiedadAgregada();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="w-full max-w-lg p-6 border shadow-2xl rounded-xl bg-neutral-900 border-violet-700">
        <h2 className="mb-4 text-2xl font-bold text-center text-violet-400">
          Registrar Propiedad
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          <input
            name="titulo"
            placeholder="Título de la propiedad *"
            required
            value={form.titulo}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-neutral-800 border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
            disabled={loading}
          />

          <textarea
            name="descripcion"
            placeholder="Descripción / detalles"
            value={form.descripcion}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded bg-neutral-800 border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
            disabled={loading}
          />

          <input
            name="precio_mensual"
            type="number"
            step="0.01"
            placeholder="Precio mensual *"
            value={form.precio_mensual}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-neutral-800 border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
            disabled={loading}
          />

          <select
            name="tipo_alquiler"
            value={form.tipo_alquiler}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-neutral-800 border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
            disabled={loading}
          >
            <option value="permanente">Permanente</option>
            <option value="temporal">Temporal</option>
          </select>

          <input
            name="habitaciones"
            type="number"
            min={1}
            placeholder="Cantidad de habitaciones *"
            value={form.habitaciones}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-neutral-800 border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
            disabled={loading}
          />

          <input
            name="provincia"
            placeholder="Provincia *"
            value={form.provincia}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-neutral-800 border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
            disabled={loading}
          />

          <input
            name="ciudad"
            placeholder="Ciudad *"
            value={form.ciudad}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-neutral-800 border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
            disabled={loading}
          />

          <select
            name="tipo_publicacion"
            value={form.tipo_publicacion}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-neutral-800 border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
            disabled={loading}
          >
            <option value="dueño directo">Dueño directo</option>
            <option value="inmobiliaria">Inmobiliaria</option>
          </select>

          <label className="flex items-center space-x-2 text-violet-300">
            <input
              type="checkbox"
              name="contrato_incluido"
              checked={form.contrato_incluido}
              onChange={handleChange}
              disabled={loading}
              className="accent-violet-500"
            />
            <span>Contrato incluido</span>
          </label>

          <label className="flex items-center space-x-2 text-violet-300">
            <input
              type="checkbox"
              name="disponible"
              checked={form.disponible}
              onChange={handleChange}
              disabled={loading}
              className="accent-violet-500"
            />
            <span>Disponible</span>
          </label>

          {/* Nuevo: Checkbox Amueblado */}
          <label className="flex items-center space-x-2 text-violet-300">
            <input
              type="checkbox"
              name="amueblado"
              checked={form.amueblado}
              onChange={handleChange}
              disabled={loading}
              className="accent-violet-500"
            />
            <span>Amueblado</span>
          </label>

          <input
            type="file"
            name="imagen"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm text-violet-300"
            disabled={loading}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white rounded bg-violet-600 hover:bg-violet-700"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Propiedad"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
