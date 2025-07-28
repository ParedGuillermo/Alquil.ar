// src/pages/CargarPropiedad.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

const TIPOS = ["Departamento", "Casa", "Estudio", "Loft", "Monoambiente"];
const GESTIONES = ["Dueño Directo", "Inmobiliaria"];
const MAX_IMAGENES = 5;

const CargarPropiedad = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    direccion: "",
    imagenes: [], // aquí guardamos array de URLs
    tipo: "",
    gestion: "",
    contacto: "",
    habitaciones: 0,
    superficie: 0,
    permiten_mascotas: false,
    permiten_ninos: false,
    servicios_incluidos: false,
    amoblado: false,
    fecha_ingreso: "",
    latitud: "",
    longitud: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      supabase
        .from("propiedades")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            const fechaIngresoStr = data.fecha_ingreso
              ? new Date(data.fecha_ingreso).toISOString().slice(0, 10)
              : "";
            setForm({
              ...data,
              fecha_ingreso: fechaIngresoStr,
              precio: data.precio.toString(),
              habitaciones: data.habitaciones || 0,
              superficie: data.superficie || 0,
              latitud: data.latitud || "",
              longitud: data.longitud || "",
              permiten_mascotas: !!data.permiten_mascotas,
              permiten_ninos: !!data.permiten_ninos,
              servicios_incluidos: !!data.servicios_incluidos,
              amoblado: !!data.amoblado,
              imagenes: data.imagenes || [],
            });
          }
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Función para subir imágenes a Supabase Storage
  const uploadImages = async (files) => {
    setUploading(true);

    const uploadedUrls = [];

    for (let file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) {
        alert(`Error al subir imagen ${file.name}: ${uploadError.message}`);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrlData.publicUrl);
    }

    setUploading(false);
    return uploadedUrls;
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const totalSelected = form.imagenes.length + files.length;
    if (totalSelected > MAX_IMAGENES) {
      alert(`Solo podés subir hasta ${MAX_IMAGENES} imágenes en total.`);
      return;
    }

    const urls = await uploadImages(files);
    setForm((prev) => ({
      ...prev,
      imagenes: [...prev.imagenes, ...urls],
    }));

    // reset file input
    e.target.value = null;
  };

  const eliminarImagen = (url) => {
    setForm((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((img) => img !== url),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.titulo || !form.descripcion || !form.precio || !form.direccion) {
      alert("Por favor completá todos los campos obligatorios");
      return;
    }

    setLoading(true);

    const dataToSave = {
      titulo: form.titulo,
      descripcion: form.descripcion,
      precio: parseInt(form.precio),
      direccion: form.direccion,
      imagenes: form.imagenes,
      tipo: form.tipo,
      gestion: form.gestion,
      contacto: form.contacto,
      habitaciones: parseInt(form.habitaciones),
      superficie: parseInt(form.superficie),
      permiten_mascotas: form.permiten_mascotas,
      permiten_ninos: form.permiten_ninos,
      servicios_incluidos: form.servicios_incluidos,
      amoblado: form.amoblado,
      fecha_ingreso: form.fecha_ingreso || null,
      latitud: form.latitud ? parseFloat(form.latitud) : null,
      longitud: form.longitud ? parseFloat(form.longitud) : null,
    };

    if (id) {
      const { error } = await supabase
        .from("propiedades")
        .update(dataToSave)
        .eq("id", id);
      if (error) alert("Error al actualizar la propiedad");
      else navigate("/propiedades");
    } else {
      const { error } = await supabase.from("propiedades").insert(dataToSave);
      if (error) alert("Error al crear la propiedad");
      else navigate("/propiedades");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl p-6 mx-auto my-8 bg-white rounded-lg shadow-md">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
        {id ? "Editar Propiedad" : "Cargar Nueva Propiedad"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campos básicos */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Título*</label>
          <input
            type="text"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Descripción*</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Precio* (ARS)</label>
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">Dirección*</label>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
        </div>

        {/* Imágenes */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Imágenes (máx {MAX_IMAGENES})
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={uploading || form.imagenes.length >= MAX_IMAGENES}
            className="block w-full text-gray-700"
          />
          {uploading && <p className="mt-2 text-sm text-gray-600">Subiendo imágenes...</p>}

          <div className="flex flex-wrap gap-3 mt-4">
            {form.imagenes.map((url) => (
              <div key={url} className="relative w-24 h-24 overflow-hidden rounded shadow-lg">
                <img src={url} alt="Preview" className="object-cover w-full h-full" />
                <button
                  type="button"
                  onClick={() => eliminarImagen(url)}
                  className="absolute px-1 text-white bg-red-600 rounded top-1 right-1 hover:bg-red-700"
                  aria-label="Eliminar imagen"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Resto campos */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Tipo*</label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            >
              <option value="">Seleccionar tipo</option>
              {TIPOS.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">Gestión*</label>
            <select
              name="gestion"
              value={form.gestion}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            >
              <option value="">Seleccionar gestión</option>
              {GESTIONES.map((gestion) => (
                <option key={gestion} value={gestion}>
                  {gestion}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Contacto</label>
          <input
            type="text"
            name="contacto"
            value={form.contacto}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Teléfono o email"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Habitaciones</label>
            <input
              type="number"
              name="habitaciones"
              value={form.habitaciones}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">Superficie (m²)</label>
            <input
              type="number"
              name="superficie"
              value={form.superficie}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        <fieldset className="space-y-2">
          <legend className="mb-2 font-semibold text-gray-700">Características</legend>
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              name="permiten_mascotas"
              checked={form.permiten_mascotas}
              onChange={handleChange}
              className="form-checkbox text-cyan-600"
            />
            <span>Permiten mascotas</span>
          </label>

          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              name="permiten_ninos"
              checked={form.permiten_ninos}
              onChange={handleChange}
              className="form-checkbox text-cyan-600"
            />
            <span>Permiten niños</span>
          </label>

          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              name="servicios_incluidos"
              checked={form.servicios_incluidos}
              onChange={handleChange}
              className="form-checkbox text-cyan-600"
            />
            <span>Servicios incluidos</span>
          </label>

          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              name="amoblado"
              checked={form.amoblado}
              onChange={handleChange}
              className="form-checkbox text-cyan-600"
            />
            <span>Amoblado</span>
          </label>
        </fieldset>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Latitud</label>
            <input
              type="number"
              name="latitud"
              value={form.latitud}
              onChange={handleChange}
              step="any"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">Longitud</label>
            <input
              type="number"
              name="longitud"
              value={form.longitud}
              onChange={handleChange}
              step="any"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full py-3 mt-6 font-semibold text-white rounded-md bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50"
        >
          {loading ? "Guardando..." : id ? "Actualizar Propiedad" : "Crear Propiedad"}
        </button>
      </form>
    </div>
  );
};

export default CargarPropiedad;
