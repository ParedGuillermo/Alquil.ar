import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const BotonContacto = ({ usuarioDestinoId, propiedadId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);

  const iniciarChat = async () => {
    if (!user) {
      alert("Tenés que estar logueado para contactar");
      return;
    }
    setCargando(true);

    // Buscar si ya hay mensajes entre usuarios para esta propiedad
    const { data: chatExistente, error } = await supabase
      .from("mensajes")
      .select("*")
      .or(
        `and(emisor_id.eq.${user.id},receptor_id.eq.${usuarioDestinoId},propiedad_id.eq.${propiedadId}),and(emisor_id.eq.${usuarioDestinoId},receptor_id.eq.${user.id},propiedad_id.eq.${propiedadId})`
      )
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      alert("Error al buscar chat");
      setCargando(false);
      return;
    }

    if (chatExistente) {
      // Si existe chat, ir al chat (podrías tener una ruta tipo /mensajes/:id)
      navigate(`/mensajes/${chatExistente.id}`);
      setCargando(false);
      return;
    }

    // Si no existe chat, crear mensaje inicial vacío (o saludo)
    const { data, error: errorInsert } = await supabase
      .from("mensajes")
      .insert([
        {
          emisor_id: user.id,
          receptor_id: usuarioDestinoId,
          propiedad_id: propiedadId,
          contenido: "Hola, estoy interesado en tu propiedad.",
        },
      ])
      .select()
      .single();

    if (errorInsert) {
      alert("Error al iniciar chat");
      setCargando(false);
      return;
    }

    navigate(`/mensajes/${data.id}`);
    setCargando(false);
  };

  return (
    <button
      disabled={cargando}
      onClick={iniciarChat}
      className="px-4 py-2 text-white bg-green-600 rounded"
    >
      {cargando ? "Iniciando chat..." : "Contactar"}
    </button>
  );
};

export default BotonContacto;
