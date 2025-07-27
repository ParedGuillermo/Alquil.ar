import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const Conversaciones = ({ propiedadId, usuarioId }) => {
  const [conversacionId, setConversacionId] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!usuarioId || !propiedadId) return;

    const verificarConversacion = async () => {
      try {
        const { data, error } = await supabase
          .from("conversaciones")
          .select("id")
          .eq("usuario_1", usuarioId)
          .eq("usuario_2", propiedadId)
          .eq("propiedad_id", propiedadId)
          .single();

        if (error) throw error;
        if (data) {
          setConversacionId(data.id);
          obtenerMensajes(data.id);
        } else {
          crearConversacion();
        }
      } catch (error) {
        setError(error.message);
      }
    };

    verificarConversacion();
  }, [usuarioId, propiedadId]);

  const obtenerMensajes = async (conversacionId) => {
    const { data, error } = await supabase
      .from("mensajes")
      .select("*")
      .eq("conversacion_id", conversacionId)
      .order("creado_en", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setMensajes(data);
    }
  };

  const crearConversacion = async () => {
    try {
      const { data, error } = await supabase
        .from("conversaciones")
        .insert([
          {
            usuario_1: usuarioId,
            usuario_2: propiedadId,
            propiedad_id: propiedadId,
          },
        ])
        .single();

      if (error) throw error;
      setConversacionId(data.id);
      obtenerMensajes(data.id);
    } catch (error) {
      setError(error.message);
    }
  };

  const enviarMensaje = async () => {
    if (!nuevoMensaje) return;

    try {
      const { error } = await supabase
        .from("mensajes")
        .insert([
          {
            emisor_id: usuarioId,
            receptor_id: propiedadId,
            contenido: nuevoMensaje,
            conversacion_id: conversacionId,
          },
        ]);

      if (error) throw error;
      setNuevoMensaje("");
      obtenerMensajes(conversacionId);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Conversación</h2>
      {error && <p>{error}</p>}
      <div>
        {mensajes.map((mensaje) => (
          <div key={mensaje.id}>
            <p>{mensaje.contenido}</p>
          </div>
        ))}
      </div>
      <textarea
        value={nuevoMensaje}
        onChange={(e) => setNuevoMensaje(e.target.value)}
        placeholder="Escribe tu mensaje..."
      />
      <button onClick={enviarMensaje}>Enviar</button>
    </div>
  );
};

export default Conversaciones;
