import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function FeaturedPets({ summary = false, maxItems = 10 }) {
  const [mascotas, setMascotas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMascotas = async () => {
      const { data, error } = await supabase
        .from("mascotas")
        .select("*")
        .eq("estado", "en_adopcion")
        .limit(maxItems);
      if (error) console.error("Error mascotas:", error.message);
      else setMascotas(data);
    };
    fetchMascotas();
  }, [maxItems]);

  if (mascotas.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        No hay mascotas disponibles para adopción por ahora.
      </div>
    );
  }

  return (
    <section aria-label="Mascotas en adopción">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-extrabold text-primary-dark">
          Mascotas en Adopción
        </h2>
        {summary && (
          <button
            onClick={() => navigate("/adopciones")}
            className="text-sm font-semibold rounded text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent-light"
          >
            Ver más →
          </button>
        )}
      </div>

      <div className="flex pb-2 space-x-4 overflow-x-auto">
        {mascotas.map((m) => (
          <div
            key={m.id}
            className="min-w-[160px] bg-white shadow rounded-lg p-3 cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/adopciones/${m.id}`)}
          >
            <img
              src={m.foto_url}
              alt={m.nombre}
              className="object-cover w-full mb-2 rounded h-28"
              loading="lazy"
            />
            <p className="text-sm font-semibold">{m.nombre}</p>
            <p className="text-xs text-gray-500">{m.raza || m.especie}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
