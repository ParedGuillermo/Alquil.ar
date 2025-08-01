import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Skeleton from "@mui/material/Skeleton";

import HeroSection from "../components/HeroSection";
import FeatureHighlights from "../components/FeatureHighlights";
import TestimoniosSlider from "../components/TestimoniosSlider";
import Footer from "../components/Footer";

import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
} from "react-leaflet";
import { Icon } from "leaflet";

const markerIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

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

  const propiedadesConUbicacion = data.filter(
    (p) => p.latitud != null && p.longitud != null
  );

  const isMobile = window.innerWidth <= 640;

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-background text-textPrimary">
      {/* Hero */}
      <HeroSection />

      {/* Mapa con propiedades */}
      <section className="container relative z-0 px-4 py-10 mx-auto">
        <h2 className="mb-6 text-3xl font-bold text-center text-primary">
          Propiedades en el mapa
        </h2>

        {propiedadesConUbicacion.length > 0 ? (
          <div className="relative z-0">
            <MapContainer
              center={[
                propiedadesConUbicacion[0].latitud,
                propiedadesConUbicacion[0].longitud,
              ]}
              zoom={12}
              style={{ height: isMobile ? "300px" : "400px", width: "100%" }}
              scrollWheelZoom={!isMobile}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {propiedadesConUbicacion.map((prop) => (
                <Marker
                  key={prop.id}
                  position={[prop.latitud, prop.longitud]}
                  icon={markerIcon}
                  eventHandlers={{
                    click: () => navigate("/mapa-alquileres"),
                  }}
                >
                  <Tooltip>{prop.titulo}</Tooltip>
                </Marker>
              ))}
            </MapContainer>
          </div>
        ) : (
          <p className="py-10 text-center text-gray-600">
            No hay propiedades con ubicación disponible.
          </p>
        )}
      </section>

      {/* Feature highlights */}
      <FeatureHighlights />

      {/* Sección Nosotros */}
      <motion.section
        className="container px-4 py-16 mx-auto text-center md:text-left md:grid md:grid-cols-2 md:items-center md:gap-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div>
          <h2 className="mb-6 text-4xl font-bold text-primary">Quiénes Somos</h2>
          <p className="max-w-xl mb-6 text-lg leading-relaxed text-textPrimary">
            En AlquilAr facilitamos el acceso a alquileres seguros y transparentes en Argentina.
            Nuestra plataforma conecta directamente a inquilinos y propietarios para generar confianza y transparencia.
          </p>
          <motion.button
            onClick={() => navigate("/nosotros")}
            className="px-6 py-3 font-semibold text-white rounded-lg bg-cyan-600 hover:bg-cyan-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Conocer más sobre Alquil.ar"
          >
            Conocer Más
          </motion.button>
        </div>
        <div>
          <img
            src="/hero-nosotros.jpg"
            alt="Equipo Alquil.ar"
            className="shadow-lg rounded-xl"
            loading="lazy"
          />
        </div>
      </motion.section>

      {/* Propiedades destacadas */}
      <motion.section
        className="container flex-grow px-4 py-16 mx-auto"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              staggerChildren: 0.15,
              duration: 0.6,
            },
          },
        }}
      >
        <h2 className="mb-10 text-4xl font-bold text-center text-primary">
          Propiedades Destacadas
        </h2>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Skeleton variant="rectangular" height={256} />
                  <Skeleton width="80%" />
                  <Skeleton width="60%" />
                </motion.div>
              ))
            : data.map((prop, i) => (
                <motion.div
                  key={prop.id}
                  whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.97 }}
                  className="relative overflow-hidden shadow-xl cursor-pointer group rounded-2xl"
                  onClick={() => navigate(`/propiedad/${prop.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      navigate(`/propiedad/${prop.id}`);
                    }
                  }}
                  aria-label={`Ver detalles de la propiedad ${prop.titulo}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
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
                        aria-label={`Detalles de ${prop.titulo}`}
                      >
                        Detalles
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>
      </motion.section>

      {/* Testimonios */}
      <TestimoniosSlider />

      {/* Footer */}
      <Footer />
    </div>
  );
}
