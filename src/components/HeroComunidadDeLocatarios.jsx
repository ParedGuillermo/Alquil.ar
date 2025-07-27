import React from "react";
import { useNavigate } from "react-router-dom";

export default function HeroComunidadAlquiler() {
  const navigate = useNavigate();

  return (
    <div className="relative p-6 mb-12 rounded-lg shadow-lg bg-gradient-to-b from-green-900 to-green-800 text-white sm:p-12 border-4 border-green-600 shadow-[0_0_10px_5px_rgba(34,139,34,0.7)]">
      {/* Fondo oscuro con opacidad */}
      <div className="absolute inset-0 bg-black rounded-lg opacity-40"></div>

      <div className="relative z-10 text-center">
        <h2 className="mb-4 text-4xl font-extrabold text-green-400 sm:text-5xl drop-shadow-md">
          ¡Unite a la Comunidad de Alquileres Habituales!
        </h2>
        <p className="mb-6 text-lg text-green-200 sm:text-xl drop-shadow-md">
          Conectá con inquilinos y propietarios, compartí consejos, experiencias y novedades para alquilar con confianza y seguridad.
        </p>

        <button
          onClick={() => navigate('/comunidad-alquiler')}
          className="px-6 py-3 text-lg font-semibold text-white transition bg-green-500 rounded-full shadow-lg hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 active:scale-95"
        >
          Unirse a la Comunidad
        </button>
      </div>
    </div>
  );
}
