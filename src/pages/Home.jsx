import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

// Icono marcador para el mini mapa
const markerIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Home() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const { data: propiedades, error } = await supabase
        .from("propiedades")
        .select("*")
        .limit(6);

      if (error) {
        alert("Error cargando propiedades: " + error.message);
      } else {
        setData(propiedades);
      }
    }
    fetchData();
  }, []);

  // Componente carrusel para mostrar imágenes
  const Carousel = ({ images }) => {
    const [index, setIndex] = useState(0);
    const timeoutRef = useRef(null);

    useEffect(() => {
      timeoutRef.current = setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 4000);
      return () => clearTimeout(timeoutRef.current);
    }, [index, images.length]);

    if (!images || images.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500 bg-gray-300 rounded-xl">
          Sin imagen
        </div>
      );
    }

    return (
      <div className="relative h-64 overflow-hidden rounded-xl">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Imagen ${i + 1}`}
            className={`absolute top-0 left-0 w-full h-64 object-cover transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
          />
        ))}
        {/* Botones manuales */}
        <div className="absolute flex gap-2 -translate-x-1/2 bottom-3 left-1/2">
          {images.map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full ${
                i === index ? "bg-white" : "bg-gray-400"
              }`}
              onClick={() => setIndex(i)}
              aria-label={`Mostrar imagen ${i + 1}`}
              type="button"
            />
          ))}
        </div>
      </div>
    );
  };

  // Filtramos propiedades que tengan latitud y longitud para el mapa
  const propiedadesConUbicacion = data.filter(
    (p) => p.latitud != null && p.longitud != null
  );

  return (
    <div className="min-h-screen bg-background text-textPrimary">
      {/* Hero Section */}
      <section
        className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url(/hero.jpg)" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl"></div>
        <div className="relative z-10 max-w-3xl px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold">Encuentra tu hogar perfecto</h1>
          <p className="mb-6 text-lg">Explora propiedades exclusivas cerca de ti</p>
          <button
            onClick={() => navigate("/propiedades")}
            className="px-6 py-3 font-semibold text-white transition rounded-lg shadow-lg bg-secondary hover:bg-secondary-dark"
          >
            Ver Propiedades
          </button>
        </div>
      </section>

      {/* Nueva sección: Mapa compacto */}
      <section className="container px-4 py-12 mx-auto">
        <h2 className="mb-6 text-3xl font-semibold text-center">Mapa de Propiedades</h2>
        <div className="relative z-0 max-w-4xl mx-auto">
          {propiedadesConUbicacion.length > 0 ? (
            <MapContainer
              center={[
                propiedadesConUbicacion[0].latitud,
                propiedadesConUbicacion[0].longitud,
              ]}
              zoom={13}
              style={{ height: "300px", width: "100%" }}
              scrollWheelZoom={false}
              dragging={false}
              doubleClickZoom={false}
              zoomControl={false}
              attributionControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
              />
              {propiedadesConUbicacion.map((prop) => (
                <Marker
                  key={prop.id}
                  position={[prop.latitud, prop.longitud]}
                  icon={markerIcon}
                  eventHandlers={{
                    click: () => navigate(`/propiedad/${prop.id}`),
                  }}
                />
              ))}
            </MapContainer>
          ) : (
            <p className="text-center text-gray-600">No hay propiedades con ubicación disponible.</p>
          )}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate("/mapa-alquileres")}
              className="px-6 py-3 font-semibold text-white rounded-lg bg-cyan-600 hover:bg-cyan-700"
            >
              Ver Mapa Completo
            </button>
          </div>
        </div>
      </section>

      {/* Featured Properties Grid */}
      <section className="container px-4 py-12 mx-auto">
        <h2 className="mb-8 text-3xl font-semibold text-center">
          Propiedades Destacadas
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((prop) => (
            <div
              key={prop.id}
              className="relative overflow-hidden shadow-lg cursor-pointer group rounded-xl"
              onClick={() => navigate(`/propiedad/${prop.id}`)}
            >
              {/* Carrusel */}
              <Carousel images={prop.imagenes || []} />

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-transparent rounded-b-xl">
                <h3 className="text-xl font-bold text-white truncate">
                  {prop.titulo}
                </h3>
                <p className="mt-1 text-sm text-gray-300 truncate">
                  {prop.direccion}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-semibold text-secondary">
                    {prop.precio.toLocaleString("es-AR")} ARS
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/propiedad/${prop.id}`);
                    }}
                    className="px-4 py-2 font-medium text-black transition rounded-md bg-accent hover:bg-accent-dark"
                  >
                    Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
