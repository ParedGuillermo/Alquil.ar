import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Mensajes() {
  const [searchParams] = useSearchParams();
  const chatWithUserId = searchParams.get("usuario_id");

  const [currentUser, setCurrentUser] = useState(null);
  const [conversaciones, setConversaciones] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedConversacionId, setSelectedConversacionId] = useState(null);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [loadingConversaciones, setLoadingConversaciones] = useState(true);
  const [loadingMensajes, setLoadingMensajes] = useState(false);

  const messagesEndRef = useRef(null);

  // Obtener usuario logueado al montar componente
  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error al obtener usuario:", error.message);
      } else {
        setCurrentUser(user);
      }
    }
    fetchUser();
  }, []);

  // Cargar conversaciones del usuario logueado
  async function fetchConversaciones() {
    if (!currentUser) return;
    setLoadingConversaciones(true);

    const { data, error } = await supabase
      .from("conversaciones")
      .select(`
        id,
        usuario_1,
        usuario_2,
        ultimo_mensaje,
        usuarios_1:usuarios!usuario_1_fkey (id, nombre),
        usuarios_2:usuarios!usuario_2_fkey (id, nombre)
      `)
      .or(`usuario_1.eq.${currentUser.id},usuario_2.eq.${currentUser.id}`)
      .order("ultimo_mensaje", { ascending: false });

    if (error) {
      console.error("Error cargando conversaciones:", error.message);
      setConversaciones([]);
    } else {
      setConversaciones(data || []);
    }
    setLoadingConversaciones(false);
  }

  // Obtener mensajes de conversación
  async function fetchMensajes(conversacionId) {
    if (!conversacionId) return;
    setLoadingMensajes(true);

    const { data, error } = await supabase
      .from("mensajes")
      .select("*")
      .eq("conversacion_id", conversacionId)
      .order("creado_en", { ascending: true });

    if (error) {
      console.error("Error cargando mensajes:", error.message);
      setMensajes([]);
    } else {
      setMensajes(data || []);
    }
    setLoadingMensajes(false);
    scrollToBottom();
  }

  // Crear o abrir conversación
  async function openConversacion(usuarioDestinoId) {
    if (!currentUser) return;

    const { data, error } = await supabase
      .from("conversaciones")
      .select("*")
      .or(
        `(usuario_1.eq.${currentUser.id},usuario_2.eq.${usuarioDestinoId}),` +
          `(usuario_1.eq.${usuarioDestinoId},usuario_2.eq.${currentUser.id})`
      )
      .limit(1);

    if (error) {
      alert("Error buscando conversación");
      return;
    }

    if (data.length === 0) {
      // Crear conversación nueva
      const { data: newConv, error: errCreate } = await supabase
        .from("conversaciones")
        .insert({
          usuario_1: currentUser.id,
          usuario_2: usuarioDestinoId,
          ultimo_mensaje: new Date(),
        })
        .select()
        .single();

      if (errCreate) {
        alert("Error creando conversación");
        return;
      }

      setSelectedUser(usuarioDestinoId);
      setSelectedConversacionId(newConv.id);
      await fetchMensajes(newConv.id);
    } else {
      setSelectedUser(usuarioDestinoId);
      setSelectedConversacionId(data[0].id);
      await fetchMensajes(data[0].id);
    }
  }

  // Enviar mensaje
  async function enviarMensaje() {
    if (!nuevoMensaje.trim() || !selectedUser || !selectedConversacionId) return;

    const { error: errorInsert } = await supabase.from("mensajes").insert({
      conversacion_id: selectedConversacionId,
      emisor_id: currentUser.id,
      receptor_id: selectedUser,
      contenido: nuevoMensaje.trim(),
      creado_en: new Date(),
    });

    if (errorInsert) {
      alert("Error enviando mensaje");
      return;
    }

    // Actualizar último mensaje en la conversación
    await supabase
      .from("conversaciones")
      .update({ ultimo_mensaje: new Date() })
      .eq("id", selectedConversacionId);

    setNuevoMensaje("");
    await fetchMensajes(selectedConversacionId);
    await fetchConversaciones();
  }

  // Scroll hacia abajo en el chat
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Carga inicial de conversaciones y abrir conversación si viene en query param
  useEffect(() => {
    if (currentUser) {
      fetchConversaciones();
    }
  }, [currentUser]);

  useEffect(() => {
    if (chatWithUserId && currentUser) {
      openConversacion(chatWithUserId);
    }
  }, [chatWithUserId, currentUser]);

  // Obtener nombre usuario en conversación
  const getNombreUsuario = (userId) => {
    if (!conversaciones) return "";
    const conv = conversaciones.find(
      (c) => c.usuario_1 === userId || c.usuario_2 === userId
    );
    if (!conv) return "";

    if (conv.usuario_1 === userId) return conv.usuarios_1?.nombre || "";
    if (conv.usuario_2 === userId) return conv.usuarios_2?.nombre || "";
    return "";
  };

  if (!currentUser) return <p className="p-4">Cargando usuario...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 md:flex-row">
      {/* Lista conversaciones */}
      <aside className="w-full bg-white border-r border-gray-200 md:w-1/3 lg:w-1/4">
        <h2 className="p-4 text-xl font-bold border-b border-gray-200">
          Conversaciones
        </h2>
        {loadingConversaciones ? (
          <p className="p-4 text-gray-600">Cargando...</p>
        ) : conversaciones.length === 0 ? (
          <p className="p-4 text-gray-600">No tienes conversaciones</p>
        ) : (
          <ul>
            {conversaciones.map((conv) => {
              const usuarioOtro =
                conv.usuario_1 === currentUser.id ? conv.usuario_2 : conv.usuario_1;
              const nombreOtro =
                conv.usuario_1 === currentUser.id
                  ? conv.usuarios_2?.nombre
                  : conv.usuarios_1?.nombre;

              return (
                <li
                  key={conv.id}
                  onClick={() => openConversacion(usuarioOtro)}
                  className={`cursor-pointer p-4 border-b border-gray-200 ${
                    usuarioOtro === selectedUser ? "bg-blue-100" : "bg-white"
                  }`}
                >
                  <strong>{nombreOtro || "Usuario"}</strong>
                  <p className="text-sm text-gray-600 truncate">
                    {conv.ultimo_mensaje
                      ? new Date(conv.ultimo_mensaje).toLocaleString()
                      : ""}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </aside>

      {/* Chat */}
      <main className="flex flex-col flex-grow w-full max-h-screen p-4 overflow-hidden md:w-2/3 lg:w-3/4">
        {!selectedUser ? (
          <div className="flex items-center justify-center flex-grow text-gray-600">
            Seleccioná una conversación
          </div>
        ) : (
          <>
            <header className="flex items-center justify-between p-2 mb-4 bg-white rounded shadow">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-2 py-1 text-sm font-semibold text-blue-600 rounded hover:bg-blue-100 md:hidden"
              >
                ← Volver
              </button>
              <h3 className="text-lg font-semibold">
                Chat con {getNombreUsuario(selectedUser) || "Usuario"}
              </h3>
            </header>

            <section className="flex flex-col flex-grow px-2 mb-4 space-y-3 overflow-y-auto bg-white rounded shadow">
              {loadingMensajes ? (
                <p className="m-auto text-gray-600">Cargando mensajes...</p>
              ) : mensajes.length === 0 ? (
                <p className="m-auto text-gray-600">No hay mensajes aún.</p>
              ) : (
                mensajes.map((msg) => {
                  const esEmisor = msg.emisor_id === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`max-w-xs px-4 py-2 rounded-lg break-words ${
                        esEmisor
                          ? "ml-auto bg-blue-600 text-white"
                          : "mr-auto bg-gray-200"
                      }`}
                    >
                      {msg.contenido}
                      <div className="mt-1 text-xs text-right text-gray-300">
                        {new Date(msg.creado_en).toLocaleTimeString()}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </section>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                enviarMensaje();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Escribí un mensaje..."
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Enviar
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
