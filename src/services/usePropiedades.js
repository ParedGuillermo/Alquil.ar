import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function usePropiedades(filtros = {}) {
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPropiedades = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase.from("propiedades").select("*");

      if (filtros.ciudad) {
        query = query.ilike("ciudad", `%${filtros.ciudad}%`);
      }
      if (filtros.precioMax) {
        query = query.lte("precio_alquiler", filtros.precioMax);
      }
      if (filtros.tipoUsuario) {
        query = query.eq("tipo_usuario", filtros.tipoUsuario);
      }

      const { data, error } = await query.order("fecha_publicacion", {
        ascending: false,
      });

      if (error) {
        setError(error.message);
        setPropiedades([]);
      } else {
        setPropiedades(data);
      }
    } catch (e) {
      setError("Error inesperado al cargar propiedades");
      setPropiedades([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPropiedades();
  }, [filtros.ciudad, filtros.precioMax, filtros.tipoUsuario]);

  return { propiedades, loading, error, refetch: fetchPropiedades };
}
