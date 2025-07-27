import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Consultas() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchConsultas() {
      setLoading(true);
      const { data, error } = await supabase
        .from("consultas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) setError(error.message);
      else setConsultas(data);

      setLoading(false);
    }
    fetchConsultas();
  }, []);

  if (loading) return <p>Cargando consultas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Consultas</h2>
      {consultas.length === 0 && <p>No hay consultas.</p>}
      <ul>
        {consultas.map((c) => (
          <li key={c.id}>
            <p><b>Propiedad ID:</b> {c.propiedad_id}</p>
            <p>{c.mensaje}</p>
            <small>{new Date(c.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
