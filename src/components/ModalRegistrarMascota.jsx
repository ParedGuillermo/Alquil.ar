import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const provinciasArgentinas = [
  "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes",
  "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza",
  "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis",
  "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán",
];

function sanitizeFileName(name) {
  const nameWithoutExt = name.replace(/\.[^/.]+$/, "");
  const extension = name.split('.').pop().toLowerCase();
  return (
    nameWithoutExt
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "") +
    "." +
    extension
  );
}

export default function ModalRegistrarMascota({
  onClose,
  usuarioId,
  onMascotaAgregada,
  estadoInicial
}) {
  const [form, setForm] = useState({
    nombre: "",
    especie: "",
    raza: "",
    edad: "",
    descripcion: "",
    provincia: "",
    telefono: "",
    sexo: "",
    caracteristicas: "",
    cuidados_especiales: "",
    estado: estadoInicial || "propia",
    foto: null,
  });

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      if (files.length > 0) {
        const file = files[0];
        if (!file.type.startsWith("image/")) {
          setError("Solo se permiten archivos de imagen.");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setError("La imagen debe ser menor a 5MB.");
          return;
        }
        setError(null);
        setForm((prev) => ({ ...prev, foto: file }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let foto_url = null;

      if (form.foto) {
        setUploadingImage(true);
        const safeName = sanitizeFileName(form.foto.name);
        const fileName = `${Date.now()}_${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("pets")
          .upload(fileName, form.foto, { cacheControl: "3600", upsert: false });

        setUploadingImage(false);

        if (uploadError) {
          setError(`Error al subir la imagen: ${uploadError.message}`);
          setLoading(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("pets")
          .getPublicUrl(fileName);

        foto_url = publicUrlData.publicUrl;
      }

      if (!/^\d{6,15}$/.test(form.telefono)) {
        setError("El teléfono debe ser un número válido.");
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase.from("mascotas").insert({
        nombre: form.nombre.trim(),
        especie: form.especie.trim(),
        raza: form.raza.trim() || null,
        edad: form.edad ? parseInt(form.edad) : null,
        descripcion: form.descripcion.trim() || null,
        provincia: form.provincia || null,
        telefono: form.telefono.trim(),
        sexo: form.sexo,
        caracteristicas: form.caracteristicas.trim() || null,
        cuidados_especiales: form.cuidados_especiales.trim() || null,
        estado: form.estado,
        foto_url,
        usuario_id: usuarioId,
      });

      if (insertError) {
        setError(`Error al guardar: ${insertError.message}`);
        setLoading(false);
        return;
      }

      if (onMascotaAgregada) onMascotaAgregada();
      onClose();
    } catch (err) {
      setError(`Error inesperado: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3 bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg overflow-y-auto max-h-[90vh] p-5 sm:p-6">
        <h2 className="mb-6 text-2xl font-extrabold text-center text-green-700">
          Registrar Mascota
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-base font-medium">
          <input
            name="nombre"
            placeholder="Nombre *"
            required
            value={form.nombre}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl"
          />
          <input
            name="especie"
            placeholder="Especie *"
            required
            value={form.especie}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl"
          />
          <input
            name="raza"
            placeholder="Raza"
            value={form.raza}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl"
          />
          <input
            name="edad"
            type="number"
            min="0"
            placeholder="Edad"
            value={form.edad}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl"
          />

          <select
            name="provincia"
            value={form.provincia}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl"
            required
          >
            <option value="" disabled>Seleccioná una provincia *</option>
            {provinciasArgentinas.map((prov) => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>

          <input
            name="telefono"
            placeholder="Teléfono *"
            required
            value={form.telefono}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl"
            inputMode="tel"
            pattern="\d{6,15}"
          />

          <select
            name="sexo"
            value={form.sexo}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl"
            required
          >
            <option value="" disabled>Seleccioná el sexo *</option>
            <option value="macho">Macho</option>
            <option value="hembra">Hembra</option>
          </select>

          <textarea
            name="caracteristicas"
            placeholder="Características"
            value={form.caracteristicas}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl"
          />
          <textarea
            name="cuidados_especiales"
            placeholder="Cuidados especiales"
            value={form.cuidados_especiales}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl"
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl"
          />

          {!estadoInicial && (
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl"
              required
            >
              <option value="propia">Propia</option>
              <option value="en_adopcion">En adopción</option>
            </select>
          )}

          <input
            type="file"
            name="foto"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
          <p className="text-sm text-gray-500">Solo imágenes. Máximo 5MB.</p>
          {uploadingImage && <p className="text-sm text-blue-600">Subiendo imagen...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-green-800 bg-gray-200 rounded-full hover:bg-gray-300"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="w-full py-2 font-semibold text-white bg-green-600 rounded-full hover:bg-green-700"
            >
              {loading ? "Guardando..." : "Guardar Mascota"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
