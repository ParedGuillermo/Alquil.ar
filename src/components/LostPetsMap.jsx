// src/pages/LostPetsMap.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { supabase } from "../supabaseClient";
import L from "leaflet";

// Corrección de íconos de Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix iconos
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function LostPetsMap() {
  const [avistamientos, setAvistamientos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvistamientos = async () => {
      const { data, error } = await supabase
        .from("mascotas_perdidas")
        .select("*")
        .eq("estado", "perdida");

      if (error) {
        console.error("Error cargando avistamientos", error);
        setAvistamientos([]);
      } else {
        setAvistamientos(data || []);
      }
      setLoading(false);
    };

    fetchAvistamientos();
  }, []);

  const centroInicial = [-27.4748, -58.8341]; // Corrientes Capital

  return (
    <div className="w-full h-screen">
      {loading ? (
        <p className="p-4 text-center text-gray-500">Cargando mapa...</p>
      ) : avistamientos.length === 0 ? (
        <p className="p-4 text-center text-gray-600">
          No hay mascotas perdidas reportadas por ahora.
        </p>
      ) : (
        <MapContainer
          center={centroInicial}
          zoom={13}
          minZoom={10}
          maxZoom={18}
          scrollWheelZoom={true}
          className="z-0 w-full h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />

          {avistamientos.map((mascota) => {
            const coords = mascota.ubicacion?.split(",").map((c) => parseFloat(c.trim()));
            if (
              !coords ||
              coords.length !== 2 ||
              coords.some((v) => isNaN(v))
            ) return null;

            const [lat, lng] = coords;

            return (
              <Marker key={mascota.id} position={[lat, lng]}>
                <Popup className="max-w-xs p-3">
                  <div className="text-sm">
                    <strong>{mascota.nombre}</strong> ({mascota.tipo_mascota})<br />
                    <span className="text-xs italic text-gray-600">
                      {mascota.color} - {mascota.raza}
                    </span>
                    <p className="mt-1 text-xs text-gray-800">{mascota.descripcion}</p>
                    <p className="mt-2 text-xs">
                      <strong>Contacto:</strong> {mascota.contacto}
                      {/* Podrías agregar un botón para copiar contacto aquí */}
                    </p>
                    {mascota.foto_url && (
                      <img
                        src={mascota.foto_url}
                        alt={`Foto de ${mascota.nombre}`}
                        className="w-full mt-2 rounded shadow-sm"
                        loading="lazy"
                      />
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      )}
    </div>
  );
}
