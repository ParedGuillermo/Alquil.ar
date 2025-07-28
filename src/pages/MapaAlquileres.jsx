import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "leaflet/dist/leaflet.css";

const markerIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapaAlquileres = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPropiedades() {
      try {
        const { data, error } = await supabase
          .from("propiedades")
          .select("id, titulo, direccion, latitud, longitud")
          .not("latitud", "is", null)
          .not("longitud", "is", null);
        if (error) throw error;
        setPropiedades(data);
      } catch (err) {
        console.error("Error cargando propiedades:", err);
        setError(err.message);
      }
    }
    fetchPropiedades();
  }, []);

  if (error) {
    return (
      <div className="max-w-6xl p-4 mx-auto my-8 font-bold text-red-600">
        Error cargando propiedades: {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl p-4 mx-auto my-8">
      <h1 className="mb-6 text-3xl font-bold text-center">Mapa de Alquileres</h1>

      <MapContainer
        center={[-27.4806, -58.834]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {propiedades.map((prop) => (
          <Marker
            key={prop.id}
            position={[prop.latitud, prop.longitud]}
            icon={markerIcon}
          >
            <Popup>
              <div>
                <h3 className="font-semibold">{prop.titulo}</h3>
                <p>{prop.direccion}</p>
                <button
                  onClick={() => navigate(`/propiedad/${prop.id}`)}
                  className="px-3 py-1 mt-2 text-white rounded bg-cyan-600 hover:bg-cyan-700"
                >
                  Ver propiedad
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapaAlquileres;
