import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSolicitudes() {
      setLoading(true);
      const { data, error } = await supabase
        .from("solicitudes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) setError(error.message);
      else setSolicitudes(data);

      setLoading(false);
    }
    fetchSolicitudes();
  }, []);

  if (loading) return <p>Cargando solicitudes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Solicitudes</h2>
      {solicitudes.length === 0 && <p>No hay solicitudes.</p>}
      <ul>
        {solicitudes.map((s) => (
          <li key={s.id}>
            <p><b>Propiedad ID:</b> {s.propiedad_id}</p>
            <p>{s.mensaje}</p>
            <small>{new Date(s.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
