import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate("/buscar-alquileres");
  };

  const handlePublishClick = () => {
    navigate("/publicar-alquiler");
  };

  return (
    <section className="relative max-w-5xl px-6 py-20 mx-auto text-white shadow-lg sm:px-12 sm:py-28 bg-gradient-to-b from-green-900 via-green-800 to-green-900 rounded-3xl">
      {/* Fondo decorativo sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/30 to-green-900/50 rounded-3xl -z-10"></div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Encontrá tu próximo hogar o local para alquilar
        </h1>
        <p className="mt-6 text-lg font-medium text-green-200 sm:text-xl">
          Buscá y publicá alquileres de departamentos, casas y locales con facilidad y seguridad.
        </p>

        <div className="flex flex-col justify-center gap-4 mt-10 sm:flex-row">
          <button
            onClick={handleSearchClick}
            className="px-8 py-4 font-semibold text-green-900 transition bg-white rounded-full shadow-md hover:bg-gray-100 active:scale-95"
          >
            Buscar alquileres
          </button>
          <button
            onClick={handlePublishClick}
            className="px-8 py-4 font-semibold text-white transition bg-green-700 rounded-full shadow-md hover:bg-green-600 active:scale-95"
          >
            Publicar alquiler
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
