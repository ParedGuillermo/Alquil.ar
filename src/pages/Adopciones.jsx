import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ModalRegistrarMascota from "../components/ModalRegistrarMascota";

export default function Adopciones() {
  const [adopciones, setAdopciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Carga mascotas en adopción
  const fetchAdopciones = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("mascotas")
      .select("*")
      .eq("estado", "en_adopcion");

    if (error) {
      console.error("Error al obtener adopciones:", error.message);
      setAdopciones([]);
    } else {
      setAdopciones(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdopciones();
  }, []);

  return (
    <div className="min-h-screen p-6 font-sans bg-gray-50">
      <h1 className="mb-8 text-4xl font-extrabold text-center text-green-800">
        Mascotas en Adopción 🐾
      </h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 font-semibold text-white transition-colors bg-green-600 rounded-full hover:bg-green-700"
        >
          + Registrar adopción
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Cargando mascotas en adopción...</p>
      ) : adopciones.length === 0 ? (
        <p className="text-center text-gray-600">No hay mascotas disponibles para adopción.</p>
      ) : (
        <div className="grid max-w-6xl grid-cols-1 gap-6 mx-auto sm:grid-cols-2 md:grid-cols-3">
          {adopciones.map((mascota) => {
            const telefonoLimpio = mascota.telefono
              ? mascota.telefono.toString().replace(/\D/g, "")
              : "";

            return (
              <div
                key={mascota.id}
                className="flex flex-col items-center p-6 transition-shadow duration-300 bg-white shadow-md rounded-3xl hover:shadow-xl"
              >
                <img
                  src={mascota.foto_url || "https://placehold.co/300x300?text=Mascota"}
                  alt={mascota.nombre}
                  className="object-cover w-40 h-40 mb-5 rounded-full"
                  loading="lazy"
                />
                <h2 className="mb-2 text-2xl font-bold text-green-700">{mascota.nombre}</h2>
                <p className="mb-1 text-sm font-semibold text-gray-700">
                  {mascota.especie} - {mascota.raza || "Sin raza"}
                </p>
                <p className="mb-1 text-sm text-gray-700">
                  Edad: {mascota.edad != null ? mascota.edad : "Desconocida"} años
                </p>
                <p className="mb-3 text-sm text-center text-gray-600">
                  {mascota.descripcion || "Sin descripción"}
                </p>
                <p className="mb-1 text-sm text-gray-500">
                  Estado: {mascota.estado || "Desconocido"}
                </p>
                <p className="mb-1 text-sm text-gray-500">
                  Provincia: {mascota.provincia || "No especificada"}
                </p>

                {telefonoLimpio && (
                  <a
                    href={`https://wa.me/54${telefonoLimpio}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Contactar al dueño de ${mascota.nombre} por WhatsApp`}
                    className="inline-flex items-center px-4 py-2 mt-3 text-white transition-colors bg-green-600 rounded-full hover:bg-green-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.52 3.48A11.58 11.58 0 0012.01.5 11.59 11.59 0 001.5 12a11.51 11.51 0 001.57 5.76L.5 23.5l5.39-1.41a11.49 11.49 0 005.98 1.75h.01a11.58 11.58 0 008.13-19.36zm-8.5 17.17h-.01a9.3 9.3 0 01-4.73-1.32l-.34-.2-3.17.83.85-3.09-.22-.34a9.28 9.28 0 011.46-11.78 9.37 9.37 0 0114.44 12.21 9.33 9.33 0 01-6.28 3.65zm5.35-6.62c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15s-.73.94-.9 1.14-.33.22-.61.07a8.04 8.04 0 01-2.36-1.46 9.3 9.3 0 01-1.72-2.13c-.18-.3 0-.46.13-.61.13-.13.29-.33.44-.5a.84.84 0 00.2-.33.58.58 0 000-.55c-.07-.15-.63-1.53-.86-2.1-.23-.55-.47-.48-.64-.49a2.17 2.17 0 00-.58-.07c-.18 0-.46.07-.7.33a2.86 2.86 0 00-1.04 1.02 4.42 4.42 0 001.5 5.6 6.62 6.62 0 004.18 1.76 3.13 3.13 0 002.21-.99 2.77 2.77 0 00.84-1.3 2.07 2.07 0 00-.45-1.51z" />
                    </svg>
                    Contactar al dueño
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <ModalRegistrarMascota
          onClose={() => setShowModal(false)}
          onMascotaAgregada={() => {
            setShowModal(false);
            fetchAdopciones();
          }}
          estadoInicial="en_adopcion" // ✅ Aquí se pasa el estado predefinido
        />
      )}
    </div>
  );
}
