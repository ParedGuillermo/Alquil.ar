import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon } from "leaflet";
import { motion } from "framer-motion";
import Skeleton from "@mui/material/Skeleton";

import "leaflet/dist/leaflet.css";

import HeroSection from "../components/HeroSection";
import HeroNosotros from "../components/HeroNosotros";

// Icono marcador
const markerIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Home() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(false);
    }
    fetchData();
  }, []);

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
        <div className="flex items-center justify-center h-64 text-gray-500 bg-gray-200 rounded-xl">
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
            className={`absolute top-0 left-0 w-full h-64 object-cover transition-opacity duration-700 ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
          />
        ))}
        <div className="absolute flex gap-2 -translate-x-1/2 bottom-3 left-1/2">
          {images.map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full transition ${
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

  const propiedadesConUbicacion = data.filter(
    (p) => p.latitud != null && p.longitud != null
  );

  return (
    <div className="min-h-screen bg-background text-textPrimary">
      {/* Hero visual */}
      <HeroSection />

      {/* Mapa */}
      <motion.section
        className="container px-4 py-16 mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="mb-8 text-4xl font-bold text-center text-primary">
          Mapa de Propiedades
        </h2>
        <div className="relative z-0 max-w-5xl mx-auto overflow-hidden shadow-lg rounded-2xl">
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
                attribution='&copy; OpenStreetMap contributors'
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
            <p className="py-10 text-center text-gray-600">
              No hay propiedades con ubicación disponible.
            </p>
          )}
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/mapa-alquileres")}
            className="px-6 py-3 font-semibold text-white transition rounded-lg shadow-md bg-cyan-600 hover:bg-cyan-700"
          >
            Ver Mapa Completo
          </button>
        </div>
      </motion.section>

      {/* Propiedades destacadas */}
      <motion.section
        className="container px-4 py-16 mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="mb-10 text-4xl font-bold text-center text-primary">
          Propiedades Destacadas
        </h2>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton variant="rectangular" height={256} />
                  <Skeleton width="80%" />
                  <Skeleton width="60%" />
                </div>
              ))
            : data.map((prop) => (
                <div
                  key={prop.id}
                  className="relative overflow-hidden shadow-xl group rounded-2xl transition transform hover:scale-[1.01]"
                  onClick={() => navigate(`/propiedad/${prop.id}`)}
                >
                  <Carousel images={prop.imagenes || []} />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-b-2xl">
                    <h3 className="text-2xl font-semibold text-white truncate">
                      {prop.titulo}
                    </h3>
                    <p className="mt-1 text-sm text-gray-300 truncate">
                      {prop.direccion}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-lg font-bold text-secondary">
                        {prop.precio.toLocaleString("es-AR")} ARS
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/propiedad/${prop.id}`);
                        }}
                        className="px-4 py-2 font-medium text-black transition rounded-md shadow-sm bg-accent hover:bg-accent-dark"
                      >
                        Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </motion.section>

      {/* Nosotros final */}
      <HeroNosotros />
    </div>
  );
}
