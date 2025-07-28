import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

// Icono para el marcador
const markerIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const DetallePropiedad = () => {
  const { id } = useParams();
  const [propiedad, setPropiedad] = useState(null);

  useEffect(() => {
    const fetchPropiedad = async () => {
      const { data, error } = await supabase
        .from("propiedades")
        .select("*")
        .eq("id", id)
        .single();
      if (!error) setPropiedad(data);
    };
    fetchPropiedad();
  }, [id]);

  if (!propiedad)
    return (
      <div className="flex items-center justify-center min-h-screen text-textPrimary bg-background">
        <p className="text-lg select-none">Cargando...</p>
      </div>
    );

  return (
    <div className="min-h-screen px-4 py-6 text-textPrimary bg-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-4 text-3xl font-bold text-white">{propiedad.titulo}</h1>
        <p className="mb-2 text-lg text-cyan-400">{propiedad.direccion}</p>

        {/* Mostrar imágenes en grid simple */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2">
          {propiedad.imagenes?.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Imagen ${i + 1}`}
              className="object-cover w-full h-64 shadow-lg rounded-xl"
              loading="lazy"
            />
          ))}
        </div>

        <p className="mb-4 text-gray-300 whitespace-pre-line">{propiedad.descripcion}</p>

        {/* Mapa con ubicación */}
        {propiedad.latitud && propiedad.longitud && (
          <div className="h-64 mb-6 overflow-hidden rounded-xl">
            <MapContainer
              center={[propiedad.latitud, propiedad.longitud]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[propiedad.latitud, propiedad.longitud]}
                icon={markerIcon}
              >
                <Popup>{propiedad.titulo}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        <div className="p-4 mb-6 text-white bg-gray-800 rounded-xl">
          <p>
            <strong>Precio:</strong>{" "}
            <span className="text-cyan-400">${propiedad.precio}</span>
          </p>
          <p>
            <strong>Habitaciones:</strong> {propiedad.habitaciones}
          </p>
          <p>
            <strong>Superficie:</strong> {propiedad.superficie} m²
          </p>
          <p>
            <strong>Permiten mascotas:</strong> {propiedad.permiten_mascotas ? "Sí" : "No"}
          </p>
          <p>
            <strong>Permiten niños:</strong> {propiedad.permiten_ninos ? "Sí" : "No"}
          </p>
          <p>
            <strong>Servicios incluidos:</strong> {propiedad.servicios_incluidos ? "Sí" : "No"}
          </p>
          <p>
            <strong>Amoblado:</strong> {propiedad.amoblado ? "Sí" : "No"}
          </p>
        </div>

        <button className="w-full px-6 py-2 text-white transition rounded-lg select-none bg-cyan-600 sm:w-auto hover:bg-cyan-700">
          Contactar
        </button>
      </div>
    </div>
  );
};

export default DetallePropiedad;
