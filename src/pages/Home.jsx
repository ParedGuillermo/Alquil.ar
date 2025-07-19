import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import BottomNav from "../components/BottomNav";

export default function Home() {
  const [propiedades, setPropiedades] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCiudad, setFiltroCiudad] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPropiedades = async () => {
    setLoading(true);
    let query = supabase.from("propiedades").select("*");

    if (filtroCiudad) query = query.eq("ciudad", filtroCiudad);
    if (busqueda) query = query.ilike("titulo", `%${busqueda}%`);

    const { data, error } = await query.limit(20).order("creado_en", { ascending: false });

    if (error) {
      console.error("Error al traer propiedades:", error.message);
    } else {
      setPropiedades(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPropiedades();
  }, []);

  const handleBuscar = () => fetchPropiedades();

  return (
    <>
      <div className="flex flex-col min-h-screen pb-20 text-gray-900 bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center justify-center py-4 bg-white border-b border-gray-200 shadow-sm">
          <h1 className="text-2xl font-extrabold tracking-tight text-blue-700 select-none">Alquil.ar</h1>
        </header>

        {/* Buscador */}
        <section className="self-center w-full max-w-4xl p-5 mx-4 my-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              placeholder="Buscar propiedad (ej: departamento, casa...)"
              className="flex-1 px-5 py-3 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <select
              className="w-full px-5 py-3 transition border border-gray-300 rounded-lg sm:w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filtroCiudad}
              onChange={(e) => setFiltroCiudad(e.target.value)}
            >
              <option value="">Todas las ciudades</option>
              <option value="Buenos Aires">Buenos Aires</option>
              <option value="Córdoba">Córdoba</option>
              <option value="Rosario">Rosario</option>
              <option value="Corrientes">Corrientes</option>
            </select>
            <button
              onClick={handleBuscar}
              className="px-8 py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Buscar
            </button>
          </div>
        </section>

        {/* Propiedades */}
        <main className="flex-grow w-full max-w-6xl px-5 mx-auto mb-10">
          <h2 className="mb-6 text-xl font-semibold text-gray-800">Propiedades disponibles</h2>

          {loading ? (
            <p className="text-center text-gray-500">Cargando propiedades...</p>
          ) : propiedades.length === 0 ? (
            <p className="text-center text-gray-500">No se encontraron propiedades.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {propiedades.map((prop) => (
                <article
                  key={prop.id}
                  onClick={() => navigate(`/propiedades/${prop.id}`)}
                  className="flex flex-col overflow-hidden transition bg-white shadow-md cursor-pointer rounded-xl hover:shadow-lg"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/propiedades/${prop.id}`)}
                  aria-label={`Ver detalles de la propiedad ${prop.titulo}`}
                >
                  <div className="aspect-[4/3] relative w-full overflow-hidden rounded-t-xl">
                    <img
                      src={`https://your-project-ref.supabase.co/storage/v1/object/public/images/${prop.id}/1.jpg`}
                      alt={prop.titulo}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x300?text=Sin+imagen";
                      }}
                    />
                  </div>
                  <div className="flex flex-col flex-grow p-4">
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">{prop.titulo}</h3>
                    <p className="flex-grow text-sm text-gray-600">{prop.ciudad}</p>
                    <p className="mt-3 text-lg font-bold text-blue-700">${Number(prop.precio).toLocaleString()}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="p-4 text-xs text-center text-gray-400 border-t border-gray-200 select-none">
          &copy; 2025 Alquil.ar - Todos los derechos reservados
        </footer>
      </div>

      {/* BottomNav fijo */}
      <BottomNav />
    </>
  );
}
