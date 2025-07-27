import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function useMensajes(usuarioId, usuarioConversacionId) {
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carga mensajes entre usuarioId y usuarioConversacionId
  const fetchMensajes = async () => {
    if (!usuarioId || !usuarioConversacionId) return;
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("mensajes")
      .select("*")
      .or(
        `and(usuario_emisor.eq.${usuarioId},usuario_receptor.eq.${usuarioConversacionId}),and(usuario_emisor.eq.${usuarioConversacionId},usuario_receptor.eq.${usuarioId})`
      )
      .order("fecha_envio", { ascending: true });

    if (error) {
      setError(error.message);
      setMensajes([]);
    } else {
      setMensajes(data);
    }
    setLoading(false);
  };

  // Suscripción a mensajes nuevos en tiempo real
  useEffect(() => {
    fetchMensajes();

    const subscription = supabase
      .from(`mensajes:usuario_receptor=eq.${usuarioId}`)
      .on("INSERT", (payload) => {
        const nuevo = payload.new;
        if (
          (nuevo.usuario_emisor === usuarioId && nuevo.usuario_receptor === usuarioConversacionId) ||
          (nuevo.usuario_emisor === usuarioConversacionId && nuevo.usuario_receptor === usuarioId)
        ) {
          setMensajes((prev) => [...prev, nuevo]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [usuarioId, usuarioConversacionId]);

  // Función para enviar mensaje
  const enviarMensaje = async (texto) => {
    if (!texto.trim()) return;

    const { error } = await supabase.from("mensajes").insert([
      {
        usuario_emisor: usuarioId,
        usuario_receptor: usuarioConversacionId,
        texto: texto.trim(),
      },
    ]);

    if (error) {
      setError(error.message);
      return false;
    }

    return true;
  };

  return { mensajes, loading, error, enviarMensaje, refetch: fetchMensajes };
}
