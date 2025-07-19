import React from "react";
import { useNavigate } from "react-router-dom";

const HeroNosotros = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[450px] bg-gradient-to-r from-green-900 to-green-800 text-white py-16 px-6 text-center rounded-lg shadow-lg">
      {/* Fondo oscuro con opacidad */}
      <div className="absolute inset-0 z-0 bg-black rounded-lg opacity-40"></div>

      {/* Contenido del Hero */}
      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="mb-6 text-4xl font-extrabold text-green-400 sm:text-5xl">
          Nuestra Misión y Visión
        </h1>
        <p className="mb-6 text-lg text-green-200 sm:text-xl">
          En Alquil.ar trabajamos para conectar inquilinos y propietarios de forma segura y confiable, fomentando alquileres habituales y relaciones duraderas.
        </p>

        <p className="mb-10 text-lg text-green-200 sm:text-xl">
          Nuestro objetivo es brindar información, asesoramiento y herramientas que faciliten la experiencia de alquilar o rentar, promoviendo la transparencia y el bienestar de toda la comunidad.
        </p>

        {/* Botón CTA */}
        <button
          onClick={() => navigate("/nosotros")}
          className="px-8 py-4 text-lg font-semibold text-white transition bg-green-500 rounded-xl hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-400 active:scale-95"
        >
          Contactanos
        </button>
      </div>

      {/* Decoración SVG al pie */}
      <div className="absolute inset-x-0 bottom-0 z-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 1440 320"
          className="w-full"
        >
          <path
            fill="#064e3b"
            d="M0,128L48,160C96,192,192,256,288,256C384,256,480,192,576,181.3C672,171,768,213,864,213.3C960,213,1056,171,1152,144C1248,117,1344,107,1392,101.3L1440,96V0H1392C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0H0Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroNosotros;
