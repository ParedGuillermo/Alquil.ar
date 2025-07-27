import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const Donaciones = () => {
  const [organizaciones, setOrganizaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Para la navegación

  useEffect(() => {
    const fetchOrganizaciones = async () => {
      try {
        const { data, error } = await supabase
          .from("organizaciones")
          .select("*")
          .eq("verificada", true) // ✅ Mostrar solo verificadas
          .order("fecha_registro", { ascending: false });

        if (error) throw error;

        setOrganizaciones(data);
      } catch (error) {
        setError("Error al cargar las organizaciones.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizaciones();
  }, []);

  return (
    <div className="p-4 pt-6 pb-20 bg-gray-50">
      <h1 className="mb-4 text-3xl font-bold text-center text-green-700">
        Organizaciones que necesitan tu ayuda 🐶❤️
      </h1>

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="w-12 h-12 border-t-4 border-green-600 rounded-full animate-spin"></div>
        </div>
      )}

      {error && (
        <p className="font-semibold text-center text-red-600">{error}</p>
      )}

      {organizaciones.length === 0 && !loading && (
        <p className="text-center text-gray-500">No hay organizaciones registradas aún.</p>
      )}

      <div className="grid grid-cols-1 gap-8 mt-6 sm:grid-cols-2 lg:grid-cols-3">
        {organizaciones.map((org) => (
          <div
            key={org.id}
            className="p-6 transition-all bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl"
            onClick={() => navigate(`/donacion-detalles/${org.id}`)} // Redirige a la página de detalles
          >
            {org.logo_url && (
              <img
                src={org.logo_url}
                alt={org.nombre}
                className="object-cover w-full h-48 mb-4 rounded-lg"
              />
            )}
            <h2 className="text-2xl font-semibold text-center text-gray-800">{org.nombre}</h2>
            <p className="mt-2 text-sm text-center text-gray-600">{org.descripcion}</p>
            
            {/* Mostrar ubicación */}
            {org.ubicacion && (
              <p className="mt-2 text-sm text-center text-gray-500">{org.ubicacion}</p>
            )}
            
            <p className="mt-2 text-sm text-center text-blue-600 cursor-pointer">Haz clic para saber más</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/registrar-organizacion")}
          className="px-6 py-3 mt-6 text-xl font-semibold text-white transition-all bg-green-600 rounded-full shadow-md hover:bg-green-700"
        >
          Registrar mi organización
        </button>
      </div>
    </div>
  );
};

export default Donaciones;
