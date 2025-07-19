import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminPanel() {
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const fetchPropiedades = async () => {
    setLoading(true);
    let query = supabase.from("propiedades").select("*");

    if (busqueda) {
      query = query.ilike("titulo", `%${busqueda}%`);
    }

    const { data, error } = await query.order("fecha_publicacion", {
      ascending: false,
    });

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
  }, [busqueda]);

  const handleEliminar = async (id) => {
    if (!confirm("¿Querés eliminar esta propiedad?")) return;
    setLoading(true);
    const { error } = await supabase.from("propiedades").delete().eq("id", id);
    if (error) {
      setError(error.message);
    } else {
      fetchPropiedades();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <h1 className="mb-4 text-2xl font-bold">Panel de Administración</h1>

      <input
        type="text"
        placeholder="Buscar por título"
        className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {loading && <p>Cargando propiedades...</p>}
      {error && <p className="mb-4 text-red-600">Error: {error}</p>}

      {!loading && propiedades.length === 0 && (
        <p>No se encontraron propiedades.</p>
      )}

      <ul className="space-y-4">
        {propiedades.map((prop) => (
          <li
            key={prop.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <div>
              <h2 className="text-lg font-semibold">{prop.titulo}</h2>
              <p className="text-gray-600">Ciudad: {prop.ciudad}</p>
              <p className="text-gray-600">
                Precio: ${prop.precio_alquiler.toLocaleString()}
              </p>
            </div>

            <div className="space-x-2">
              <button
                className="px-3 py-1 text-white bg-yellow-400 rounded hover:bg-yellow-500"
                onClick={() => alert("Función editar aún no implementada")}
              >
                Editar
              </button>
              <button
                className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                onClick={() => handleEliminar(prop.id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
