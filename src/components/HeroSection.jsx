import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import fondoImage from "../assets/home/fondo.png"; // Asegurate que esta ruta esté bien

export default function HeroSection() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleCerrarModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
  };

  const handleCargarPropiedadClick = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error obteniendo sesión:", sessionError);
        return;
      }

      const user = sessionData.session?.user ?? null;

      if (user) {
        navigate("/cargar-propiedad");
      } else {
        setShowModal(true);
        document.body.style.overflow = "hidden";
      }
    } catch (error) {
      console.error("Error inesperado:", error);
    }
  };

  return (
    <>
      <section
        className={`relative px-6 py-20 text-white bg-gray-900 ${
          showModal ? "blur-sm pointer-events-none select-none" : ""
        }`}
        style={{
          backgroundImage: `url(${fondoImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-label="Sección principal para buscar y cargar propiedades"
      >
        <div className="absolute inset-0 bg-black opacity-60" aria-hidden="true"></div>
        <div className="relative z-10 flex flex-col items-center gap-10 mx-auto max-w-7xl sm:flex-row sm:items-start">
          <div className="flex-shrink-0">
            <img
              src="/logo.png"
              alt="Alquil.ar Logo"
              className="w-24 sm:w-32 md:w-40"
              loading="lazy"
            />
          </div>
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

      {/* Modal para pedir registro */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black bg-opacity-70"
        >
          <div className="max-w-md p-6 text-white bg-gray-900 rounded-lg shadow-lg">
            <h2 id="modal-title" className="mb-4 text-2xl font-bold">
              Registro requerido
            </h2>
            <p className="mb-6">
              Debe estar registrado para poder acceder a la información de contacto. Es una manera de garantizar la transparencia y evitar fraudes. El registro es libre y gratuito, y nos ayuda a reforzar la seguridad de la web.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  handleCerrarModal();
                  navigate("/register");
                }}
                className="px-4 py-2 font-semibold text-white rounded bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-400"
              >
                Registrarse / Iniciar sesión
              </button>
              <button
                onClick={() => {
                  handleCerrarModal();
                }}
                className="px-4 py-2 font-semibold text-gray-300 bg-gray-700 rounded hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-500"
              >
                Continuar navegando
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
