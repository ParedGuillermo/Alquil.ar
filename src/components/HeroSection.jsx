import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleCargarPropiedadClick = () => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        navigate("/cargar-propiedad");
      } else {
        navigate("/loginregister", { state: { redirectTo: "/cargarpropiedad" } });
      }
    });
  };

  return (
    <section
      className="relative px-6 py-16 text-center text-white bg-gray-900"
      style={{
        backgroundImage: `url('src/assets/home/fondo.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay oscuro semi-transparente */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Contenido sobre el overlay */}
      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="mb-4 text-4xl font-extrabold">Encontrá tu próximo alquiler</h1>
        <p className="mb-8 text-lg text-gray-300">
          Navegá por las mejores opciones de alquiler en Corrientes y conectá directamente con los propietarios.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleCargarPropiedadClick}
            className="px-6 py-3 text-lg font-semibold text-white transition bg-blue-700 rounded hover:bg-blue-600"
          >
            Cargar propiedad
          </button>
          <button
            onClick={() => navigate("/propiedades")}
            className="px-6 py-3 text-lg font-semibold text-blue-700 transition bg-white rounded hover:bg-gray-100"
          >
            Buscar propiedades
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
