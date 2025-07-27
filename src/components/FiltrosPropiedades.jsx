import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import ChatMessage from "../components/ChatMessage";

export default function Chat({ usuarioConversacionId }) {
  const { user } = useAuth();
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mensajesEndRef = useRef(null);

  const fetchMensajes = async () => {
    if (!user || !usuarioConversacionId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("mensajes")
      .select("*")
      .or(
        `and(emisor_id.eq.${user.id},receptor_id.eq.${usuarioConversacionId}),and(emisor_id.eq.${usuarioConversacionId},receptor_id.eq.${user.id})`
      )
      .order("creado_en", { ascending: true });

    if (error) {
      setError("Error al cargar mensajes: " + error.message);
      setMensajes([]);
    } else {
      setMensajes(data);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMensajes();

    const subscription = supabase
      .from(`mensajes:receptor_id=eq.${user?.id}`)
      .on("INSERT", (payload) => {
        const nuevo = payload.new;
        if (
          (nuevo.emisor_id === user.id && nuevo.receptor_id === usuarioConversacionId) ||
          (nuevo.emisor_id === usuarioConversacionId && nuevo.receptor_id === user.id)
        ) {
          setMensajes((prev) => [...prev, nuevo]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [user, usuarioConversacionId]);

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) return;

    const { error } = await supabase.from("mensajes").insert([
      {
        emisor_id: user.id,
        receptor_id: usuarioConversacionId,
        contenido: nuevoMensaje.trim(),
      },
    ]);

    if (error) {
      setError("Error al enviar mensaje: " + error.message);
    } else {
      setNuevoMensaje("");
      setError(null);
    }
  };

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  if (!usuarioConversacionId) {
    return <p className="p-4 text-center text-gray-600">Seleccioná un usuario para chatear.</p>;
  }

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-50">
      <div className="flex-grow mb-4 space-y-2 overflow-y-auto">
        {loading && <p>Cargando mensajes...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && mensajes.length === 0 && (
          <p className="text-center text-gray-600">No hay mensajes aún.</p>
        )}

        {mensajes.map((m) => (
          <ChatMessage key={m.id} mensaje={m} />
        ))}
        <div ref={mensajesEndRef} />
      </div>

      <div className="flex space-x-2">
        <textarea
          placeholder="Escribí un mensaje..."
          className="flex-grow px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              enviarMensaje();
            }
          }}
          disabled={loading}
          rows={2}
        />
        <button
          onClick={enviarMensaje}
          disabled={nuevoMensaje.trim() === "" || loading}
          className={`px-4 rounded-md text-white ${
            nuevoMensaje.trim() === "" || loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } transition`}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
