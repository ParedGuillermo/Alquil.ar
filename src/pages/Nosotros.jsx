import React from 'react';

const QuienesSomos = () => {
  return (
    <div className="relative text-white bg-black">
      {/* Imagen de fondo suave */}
      <div
        className="absolute inset-0 bg-center bg-cover opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c')", // podés cambiarla por una imagen más representativa
        }}
      ></div>

      {/* Contenido sobre el fondo */}
      <div className="relative z-10 max-w-3xl p-6 mx-auto backdrop-blur-md">
        <h1 className="mb-4 text-4xl font-bold text-center text-blue-300">Quiénes somos</h1>

        <p className="mb-4 text-lg leading-relaxed">
          <strong>Alquil.ar</strong> nació de una necesidad real: la de estudiantes que, como yo,
          buscan alquilar sin ser estafados. Soy Guille, estudiante universitario en Corrientes, y después de
          atravesar varias experiencias frustrantes intentando conseguir alquiler, decidí crear esta plataforma.
        </p>

        <p className="mb-4 text-lg leading-relaxed">
          Mi objetivo es claro: facilitar el acceso a alquileres reales, seguros y transparentes, especialmente
          para quienes llegan a una ciudad nueva y no conocen a nadie. Con <strong>Alquil.ar</strong> quiero que
          nadie más pase por la incertidumbre o el miedo a perder plata con una falsa publicación.
        </p>

        <p className="mb-4 text-lg leading-relaxed">
          Este proyecto es 100% independiente, hecho a pulmón, y busca construir comunidad. Es una herramienta para
          compartir información real, conectar con dueños legítimos y fomentar un sistema más justo para todos.
        </p>

        <p className="text-lg italic leading-relaxed text-gray-400">
          "Que encontrar un lugar donde vivir no se convierta en una pesadilla, sino en un paso tranquilo hacia tu nueva etapa."
        </p>
      </div>
    </div>
  );
};

export default QuienesSomos;
