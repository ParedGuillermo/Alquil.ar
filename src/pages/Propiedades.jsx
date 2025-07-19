// src/pages/Propiedades.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // Asegúrate de tener configurado tu supabase client

const Propiedades = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar las propiedades de la base de datos
  useEffect(() => {
    const fetchPropiedades = async () => {
      const { data, error } = await supabase
        .from("propiedades")
        .select("*")
        .order("creado_en", { ascending: false }); // Ordenar por fecha de creación

      if (error) {
        console.error("Error al obtener propiedades:", error);
      } else {
        setPropiedades(data);
      }
      setLoading(false);
    };

    fetchPropiedades();
  }, []);

  if (loading) return <div>Cargando propiedades...</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-semibold">Listado de Propiedades</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {propiedades.map((propiedad) => (
          <div key={propiedad.id} className="p-4 border rounded-lg">
            <h2 className="font-bold">{propiedad.titulo}</h2>
            <p>{propiedad.descripcion}</p>
            <p>{propiedad.direccion}</p>
            <p>{propiedad.ciudad}, {propiedad.provincia}</p>
            <p>${propiedad.precio}</p>
            <button className="px-4 py-2 mt-2 text-white bg-blue-600 rounded">
              Ver detalles
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Propiedades;
