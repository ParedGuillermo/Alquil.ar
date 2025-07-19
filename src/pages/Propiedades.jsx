import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Propiedades() {
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPropiedades = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("propiedades")
      .select("*")
      .order("creado_en", { ascending: false });

    if (error) {
      setError(error.message);
      setPropiedades([]);
    } else {
      setPropiedades(data);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPropiedades();
  }, []);

  if (loading) return <p className="p-4 text-center">Cargando propiedades...</p>;
  if (error) return <p className="p-4 text-center text-red-600">Error: {error}</p>;
  if (propiedades.length === 0)
    return <p className="p-4 text-center">No se encontraron propiedades.</p>;

  return (
    <div className="max-w-5xl min-h-screen p-4 mx-auto bg-gray-50">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Propiedades disponibles</h1>
      <ul className="space-y-6">
        {propiedades.map((prop) => (
          <li
            key={prop.id}
            onClick={() => navigate(`/propiedad/${prop.id}`)}
            className="flex flex-col gap-4 p-5 transition bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg sm:flex-row sm:items-center"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate(`/propiedad/${prop.id}`);
            }}
            aria-label={`Ver detalles de la propiedad ${prop.titulo}`}
          >
            <div className="flex-shrink-0 w-full h-32 overflow-hidden bg-gray-200 rounded-md sm:w-48">
              <img
                src={`https://your-project-ref.supabase.co/storage/v1/object/public/images/${prop.id}/1.jpg`}
                alt={prop.titulo}
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/192x128?text=Sin+imagen";
                }}
              />
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-semibold text-gray-900">{prop.titulo}</h2>
              <p className="text-gray-600">{prop.ciudad}, {prop.provincia}</p>
              <p className="mt-1 text-gray-700">{prop.descripcion?.slice(0, 100)}{prop.descripcion?.length > 100 ? "..." : ""}</p>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                <span>Tipo: <strong>{prop.tipo}</strong></span>
                <span>Habitaciones: <strong>{prop.habitaciones ?? "N/A"}</strong></span>
                <span>Baños: <strong>{prop.banos ?? "N/A"}</strong></span>
              </div>
              <p className="mt-3 text-lg font-bold text-blue-700">${Number(prop.precio).toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
