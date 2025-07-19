import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function FormConsulta({ propiedadId, usuarioId }) {
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function enviarConsulta(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const { error } = await supabase.from("consultas").insert([
      {
        propiedad_id: propiedadId,
        usuario_id: usuarioId,
        mensaje,
      },
    ]);

    setLoading(false);

    if (error) setError(error.message);
    else {
      setMensaje("");
      setSuccess(true);
    }
  }

  return (
    <form onSubmit={enviarConsulta}>
      <textarea
        placeholder="Escribe tu consulta"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar Consulta"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Consulta enviada.</p>}
    </form>
  );
}
