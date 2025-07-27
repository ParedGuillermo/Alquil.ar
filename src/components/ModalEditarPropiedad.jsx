import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function ModalEditarArticulo({ articulo, onClose, onArticuloActualizado }) {
  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
    precio: "",
    stock: "",
    categoria: "",
    marca: "",
    disponible: true,
    imagen: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (articulo) {
      setForm({
        titulo: articulo.titulo || "",
        contenido: articulo.contenido || "",
        precio: articulo.precio || "",
        stock: articulo.stock || "",
        categoria: articulo.categoria || "",
        marca: articulo.marca || "",
        disponible: articulo.disponible ?? true,
        imagen: null,
      });
    }
  }, [articulo]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, imagen: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imagen_url = articulo.imagen_url;

      if (form.imagen) {
        const fileName = `articulos/${Date.now()}_${form.imagen.name}`;
        const { error: uploadError } = await supabase.storage
          .from("articulos")  // Bucket actualizado
          .upload(fileName, form.imagen);

        if (uploadError) {
          throw new Error("Error al subir imagen: " + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from("articulos")  // Bucket actualizado
          .getPublicUrl(fileName);

        imagen_url = publicUrlData.publicUrl;
      }

      const { error: updateError } = await supabase
        .from("articulos")
        .update({
          titulo: form.titulo.trim(),
          contenido: form.contenido?.trim() || null,
          precio: parseFloat(form.precio) || 0,
          stock: parseInt(form.stock) || 0,
          imagen_url,
          categoria: form.categoria || null,
          marca: form.marca || null,
          disponible: form.disponible,
        })
        .eq("id", articulo.id);

      if (updateError) {
        throw new Error("Error al actualizar el artículo: " + updateError.message);
      }

      if (onArticuloActualizado) onArticuloActualizado();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="w-full max-w-lg p-6 text-white rounded-lg shadow-lg bg-neutral-900">
        <h2 className="mb-4 text-xl font-semibold text-center text-violet-400">Editar Producto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="titulo"
            placeholder="Título *"
            required
            value={form.titulo}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-neutral-800 border-violet-600 focus:outline-none focus:ring focus:ring-violet-500"
            disabled={loading}
          />

          <textarea
            name="contenido"
            placeholder="Descripción / Detalles"
            value={form.contenido}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-neutral-800 border-violet-600 focus:outline-none focus:ring focus:ring-violet-500"
            rows={4}
            disabled={loading}
          />

          <input
            name="precio"
            type="number"
            step="0.01"
            placeholder="Precio *"
            value={form.precio}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-neutral-800 border-violet-600"
            required
            disabled={loading}
          />

          <input
            name="stock"
            type="number"
            placeholder="Stock disponible"
            value={form.stock}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-neutral-800 border-violet-600"
            disabled={loading}
          />

          <input
            name="categoria"
            placeholder="Categoría"
            value={form.categoria}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-neutral-800 border-violet-600"
            disabled={loading}
          />

          <input
            name="marca"
            placeholder="Marca"
            value={form.marca}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-neutral-800 border-violet-600"
            disabled={loading}
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="disponible"
              checked={form.disponible}
              onChange={handleChange}
              disabled={loading}
            />
            <span>Disponible para la venta</span>
          </label>

          <input
            type="file"
            name="imagen"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm"
            disabled={loading}
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white rounded bg-violet-700 hover:bg-violet-800"
            >
              {loading ? "Guardando..." : "Actualizar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
