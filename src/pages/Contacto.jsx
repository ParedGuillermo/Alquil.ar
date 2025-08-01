import React from "react";

const Contacto = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 text-white bg-gray-900">
      <div className="w-full max-w-xl text-center">
        <img
          src="/assets/home/logo.png"
          alt="Logo Alquil.ar"
          className="w-48 h-auto mx-auto mb-8" // ⬅️ logo más grande
        />
        <h1 className="mb-6 text-3xl font-bold">Contacto</h1>
        <p className="mb-4 text-gray-300">
          <strong>Alquil.ar</strong> es un proyecto 100% virtual enfocado en facilitar el acceso a propiedades en alquiler en Corrientes y alrededores. No contamos con oficinas físicas ni atención presencial, lo que nos permite mantener una estructura ágil, moderna y centrada en la experiencia del usuario.
        </p>
        <p className="mb-6 text-gray-300">
          Si tenés consultas, dudas, sugerencias o necesitás comunicarte con nosotros, podés hacerlo escribiendo directamente al correo electrónico. Respondemos personalmente en el menor tiempo posible.
        </p>
        <a
          href="mailto:alquil.ar.consultas@gmail.com"
          className="inline-block px-6 py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Enviar consulta por mail
        </a>
      </div>
    </div>
  );
};

export default Contacto;
