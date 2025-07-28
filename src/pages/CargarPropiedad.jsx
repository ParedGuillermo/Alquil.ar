import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const MAX_IMAGES = 5;

const markerIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationSelector({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : <Marker position={position} icon={markerIcon} />;
}

const CargarPropiedad = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    direccion: "",
    precio: "",
    tipo: "Departamento",
    gestion: "Dueño Directo",
    contacto: "",
    habitaciones: 1,
    superficie: 0,
    permiten_mascotas: false,
    permiten_ninos: false,
    servicios_incluidos: false,
    amoblado: false,
    fecha_ingreso: "",
  });

  const [position, setPosition] = useState(null); // lat, lng
  const [imagenes, setImagenes] = useState([]); // archivos seleccionados
  const [previewUrls, setPreviewUrls] = useState([]); // previews
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Actualizar formData (excepto lat/lng)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Manejar imágenes
  const handleImageChange = (e) => {
    setError(null);
    const files = Array.from(e.target.files);

    if (files.length + imagenes.length > MAX_IMAGES) {
      setError(`Solo podés subir máximo ${MAX_IMAGES} imágenes.`);
      return;
    }

    setImagenes((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  // Eliminar imagen previa
  const handleRemoveImage = (index) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Subir imágenes a Supabase
  const uploadImages = async () => {
    const urls = [];

    for (const file of imagenes) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { publicURL, error: urlError } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      if (urlError) throw urlError;

      urls.push(publicURL);
    }

    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (
      !formData.titulo ||
      !formData.descripcion ||
      !formData.direccion ||
      !formData.precio
    ) {
      setError("Por favor completa los campos obligatorios.");
      setLoading(false);
      return;
    }

    try {
      let imagen_url = [];
      if (imagenes.length > 0) {
        imagen_url = await uploadImages();
      }

      const propiedadAInsertar = {
        ...formData,
        precio: Number(formData.precio),
        habitaciones: Number(formData.habitaciones),
        superficie: Number(formData.superficie),
        latitud: position ? position.lat : null,
        longitud: position ? position.lng : null,
        fecha_ingreso: formData.fecha_ingreso ? new Date(formData.fecha_ingreso).toISOString() : null,
        imagen_url,
      };

      const { data, error: insertError } = await supabase
        .from("propiedades")
        .insert([propiedadAInsertar]);

      if (insertError) {
        setError("Error al registrar propiedad: " + insertError.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      navigate("/propiedades");
    } catch (err) {
      setError("Error al subir imágenes: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-background text-textPrimary">
      <div className="w-full max-w-3xl p-8 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-white">Registrar Nueva Propiedad</h1>

        {error && (
          <div className="p-3 mb-4 text-red-300 bg-red-900 rounded">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-white" noValidate>
          <input
            type="text"
            name="titulo"
            placeholder="Título *"
            value={formData.titulo}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black rounded"
            required
          />

          <textarea
            name="descripcion"
            placeholder="Descripción *"
            value={formData.descripcion}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 text-black rounded"
            required
          />

          <input
            type="text"
            name="direccion"
            placeholder="Dirección *"
            value={formData.direccion}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black rounded"
            required
          />

          <input
            type="number"
            name="precio"
            placeholder="Precio en ARS *"
            value={formData.precio}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black rounded"
            required
            min={0}
          />

          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black rounded"
          >
            <option value="Departamento">Departamento</option>
            <option value="Casa">Casa</option>
            <option value="Estudio">Estudio</option>
            <option value="Loft">Loft</option>
            <option value="Monoambiente">Monoambiente</option>
          </select>

          <select
            name="gestion"
            value={formData.gestion}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black rounded"
          >
            <option value="Dueño Directo">Dueño Directo</option>
            <option value="Inmobiliaria">Inmobiliaria</option>
          </select>

          <input
            type="text"
            name="contacto"
            placeholder="Contacto (email o teléfono) *"
            value={formData.contacto}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black rounded"
            required
          />

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block mb-1">Habitaciones</label>
              <input
                type="number"
                name="habitaciones"
                min={0}
                value={formData.habitaciones}
                onChange={handleChange}
                className="w-full px-3 py-2 text-black rounded"
              />
            </div>

            <div className="flex-1">
              <label className="block mb-1">Superficie (m²)</label>
              <input
                type="number"
                name="superficie"
                min={0}
                value={formData.superficie}
                onChange={handleChange}
                className="w-full px-3 py-2 text-black rounded"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="permiten_mascotas"
                checked={formData.permiten_mascotas}
                onChange={handleChange}
              />
              <span>Permiten mascotas</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="permiten_ninos"
                checked={formData.permiten_ninos}
                onChange={handleChange}
              />
              <span>Permiten niños</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="servicios_incluidos"
                checked={formData.servicios_incluidos}
                onChange={handleChange}
              />
              <span>Servicios incluidos</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="amoblado"
                checked={formData.amoblado}
                onChange={handleChange}
              />
              <span>Amoblado</span>
            </label>
          </div>

          <input
            type="date"
            name="fecha_ingreso"
            value={formData.fecha_ingreso}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black rounded"
          />

          <div className="relative z-0 mb-6">
            <p className="mb-1 text-white">Seleccioná la ubicación en el mapa (clic para posicionar):</p>
            <div className="h-64 overflow-hidden rounded">
              <MapContainer
                center={position ?? [-27.47, -58.83]} // Corrientes centro o default
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationSelector position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
          </div>

          <div className="flex space-x-4">
            <input
              type="number"
              step="any"
              name="latitud"
              placeholder="Latitud"
              value={position ? position.lat : ""}
              onChange={(e) =>
                setPosition((prev) => ({
                  lat: Number(e.target.value),
                  lng: prev?.lng ?? 0,
                }))
              }
              className="w-full px-3 py-2 text-black rounded"
            />
            <input
              type="number"
              step="any"
              name="longitud"
              placeholder="Longitud"
              value={position ? position.lng : ""}
              onChange={(e) =>
                setPosition((prev) => ({
                  lat: prev?.lat ?? 0,
                  lng: Number(e.target.value),
                }))
              }
              className="w-full px-3 py-2 text-black rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Imágenes (máximo 5)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-white"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {previewUrls.map((url, i) => (
                <div key={i} className="relative w-20 h-20 overflow-hidden rounded-lg">
                  <img
                    src={url}
                    alt={`Imagen ${i + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-0 right-0 px-1 text-white bg-red-600 rounded-bl hover:bg-red-700"
                    aria-label={`Eliminar imagen ${i + 1}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 font-bold text-white rounded bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50"
          >
            {loading ? "Registrando..." : "Registrar Propiedad"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CargarPropiedad;
