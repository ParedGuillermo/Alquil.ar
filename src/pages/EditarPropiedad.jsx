import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

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

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

const EditarPropiedad = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPropiedad() {
      const { data, error } = await supabase.from("propiedades").select("*").eq("id", id).single();
      if (error) {
        setError("No se pudo cargar la propiedad.");
        setLoading(false);
        return;
      }
      setFormData(data);
      if (data.latitud && data.longitud) {
        setPosition({ lat: data.latitud, lng: data.longitud });
      }
      setLoading(false);
    }
    fetchPropiedad();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const updatedData = {
      ...formData,
      precio: Number(formData.precio),
      habitaciones: Number(formData.habitaciones),
      superficie: Number(formData.superficie),
      latitud: position ? position.lat : null,
      longitud: position ? position.lng : null,
      fecha_ingreso: formData.fecha_ingreso ? new Date(formData.fecha_ingreso).toISOString() : null,
    };

    const { error: updateError } = await supabase
      .from("propiedades")
      .update(updatedData)
      .eq("id", id);

    if (updateError) {
      setError("Error al actualizar propiedad: " + updateError.message);
      return;
    }

    navigate("/perfil");
  };

  if (loading) return <p className="p-6 text-white">Cargando propiedad...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-background text-textPrimary">
      <div className="w-full max-w-3xl p-8 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-white">Editar Propiedad</h1>

        {error && <div className="p-3 mb-4 text-red-300 bg-red-900 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5 text-white" noValidate>
          <label className="block font-semibold">Título</label>
          <input
            name="titulo"
            value={formData.titulo || ""}
            onChange={handleChange}
            placeholder="Título"
            className="w-full px-3 py-2 text-black rounded"
          />

          <label className="block font-semibold">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion || ""}
            onChange={handleChange}
            placeholder="Descripción"
            rows={4}
            className="w-full px-3 py-2 text-black rounded"
          />

          <label className="block font-semibold">Dirección</label>
          <input
            name="direccion"
            value={formData.direccion || ""}
            onChange={handleChange}
            placeholder="Dirección"
            className="w-full px-3 py-2 text-black rounded"
          />

          <label className="block font-semibold">Precio</label>
          <input
            name="precio"
            type="number"
            value={formData.precio || 0}
            onChange={handleChange}
            placeholder="Precio"
            className="w-full px-3 py-2 text-black rounded"
          />

          <label className="block font-semibold">Tipo</label>
          <select
            name="tipo"
            value={formData.tipo || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black rounded"
          >
            <option value="Departamento">Departamento</option>
            <option value="Casa">Casa</option>
            <option value="Estudio">Estudio</option>
            <option value="Loft">Loft</option>
            <option value="Monoambiente">Monoambiente</option>
          </select>

          <label className="block font-semibold">Gestión</label>
          <select
            name="gestion"
            value={formData.gestion || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black rounded"
          >
            <option value="Dueño Directo">Dueño Directo</option>
            <option value="Inmobiliaria">Inmobiliaria</option>
          </select>

          <label className="block font-semibold">Contacto</label>
          <input
            name="contacto"
            value={formData.contacto || ""}
            onChange={handleChange}
            placeholder="Contacto"
            className="w-full px-3 py-2 text-black rounded"
          />

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Habitaciones</label>
              <input
                type="number"
                name="habitaciones"
                value={formData.habitaciones || 0}
                onChange={handleChange}
                className="w-full px-3 py-2 text-black rounded"
                placeholder="Habitaciones"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Superficie (m²)</label>
              <input
                type="number"
                name="superficie"
                value={formData.superficie || 0}
                onChange={handleChange}
                className="w-full px-3 py-2 text-black rounded"
                placeholder="Superficie"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {['permiten_mascotas', 'permiten_ninos', 'servicios_incluidos', 'amoblado'].map((name) => (
              <label key={name} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={name}
                  checked={formData[name] || false}
                  onChange={handleChange}
                />
                <span>
                  {name
                    .replace(/_/g, " ")
                    .replace("permiten ninos", "Permiten niños")
                    .replace("permiten mascotas", "Permiten mascotas")
                    .replace("servicios incluidos", "Servicios incluidos")
                    .replace("amoblado", "Amoblado")}
                </span>
              </label>
            ))}
          </div>

          <label className="block font-semibold">Fecha de ingreso</label>
          <input
            type="date"
            name="fecha_ingreso"
            value={formData.fecha_ingreso ? formData.fecha_ingreso.slice(0, 10) : ""}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black rounded"
          />

          <div className="relative z-0 mb-6">
            <p className="mb-1 text-white">Ubicación (clic para mover el marcador):</p>
            <div className="h-64 overflow-hidden rounded">
              <MapContainer
                center={position ?? [-27.47, -58.83]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationSelector position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 font-bold text-white rounded bg-cyan-600 hover:bg-cyan-700"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditarPropiedad;
