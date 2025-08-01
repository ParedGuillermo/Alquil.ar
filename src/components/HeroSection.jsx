import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import fondoImage from "../assets/home/fondo.png"; // Importa la imagen para que React la procese

const HeroSection = () => {
  const navigate = useNavigate();

  const handleCargarPropiedadClick = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error("Error obteniendo usuario:", error);
      return;
    }

    if (user) {
      navigate("/cargar-propiedad");
    } else {
      navigate("/loginregister", { state: { redirectTo: "/cargar-propiedad" } });
    }
  };

  return (
    <section
      className="relative px-6 py-20 text-white bg-gray-900"
      style={{
        backgroundImage: `url(${fondoImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-label="Sección principal para buscar y cargar propiedades"
    >
      {/* Overlay oscuro semi-transparente */}
      <div className="absolute inset-0 bg-black opacity-60" aria-hidden="true"></div>

      {/* Contenido sobre el overlay */}
      <div className="relative z-10 flex flex-col items-center gap-10 mx-auto max-w-7xl sm:flex-row sm:items-start">
        
        {/* Logo a la izquierda */}
        <div className="flex-shrink-0">
          <img
            src="/logo.png"
            alt="Alquil.ar Logo"
            className="w-24 sm:w-32 md:w-40"
            loading="lazy"
          />
        </div>

        {/* Texto y botones a la derecha */}
        <div className="max-w-3xl text-center sm:text-left">
          <h1 className="mb-4 text-5xl font-extrabold leading-tight">
            Encontrá tu próximo alquiler
          </h1>
          <p className="mb-10 text-lg text-gray-300">
            Navegá por las mejores opciones de alquiler y conectá directamente con los propietarios.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-start">
            <button
              onClick={handleCargarPropiedadClick}
              className="px-8 py-3 text-lg font-semibold text-white transition bg-blue-700 rounded hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400"
            >
              Cargar propiedad
            </button>
            <button
              onClick={() => navigate("/propiedades")}
              className="px-8 py-3 text-lg font-semibold text-blue-700 transition bg-white rounded hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Buscar propiedades
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
