// src/pages/PropiedadDetalle.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient"; // Asegúrate de tener configurado tu supabase client

const PropiedadDetalle = () => {
  const { propiedadId } = useParams();
  const [propiedad, setPropiedad] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar los detalles de la propiedad
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      const { data, error } = await supabase
        .from("propiedades")
        .select("*")
        .eq("id", propiedadId)
        .single(); // Nos aseguramos de obtener solo una propiedad

      if (error) {
        console.error("Error al obtener propiedad:", error);
      } else {
        setPropiedad(data);
      }
      setLoading(false);
    };

    fetchPropertyDetails();
  }, [propiedadId]);

  if (loading) return <div>Cargando detalles...</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-semibold">{propiedad.titulo}</h1>
      <p>{propiedad.descripcion}</p>
      <p>{propiedad.direccion}</p>
      <p>{propiedad.ciudad}, {propiedad.provincia}</p>
      <p>${propiedad.precio}</p>
      <div className="mt-4">
        <button className="px-4 py-2 text-white bg-blue-600 rounded">
          Contactar propietario
        </button>
      </div>
    </div>
  );
};

export default PropiedadDetalle;
