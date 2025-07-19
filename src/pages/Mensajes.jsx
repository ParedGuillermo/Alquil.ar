// src/pages/Mensajes.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

const Mensajes = () => {
  const { propiedadId } = useParams();
  const [mensajes, setMensajes] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);

  // Cargar los mensajes de la propiedad
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("mensajes")
        .select("*")
        .eq("propiedad_id", propiedadId)
        .order("creado_en", { ascending: true });

      if (error) {
        console.error("Error al obtener mensajes:", error);
      } else {
        setMensajes(data);
      }
      setLoading(false);
    };

    fetchMessages();
  }, [propiedadId]);

  // Enviar un mensaje
  const handleSendMessage = async () => {
    if (mensaje.trim() === "") return;

    const { data, error } = await supabase.from("mensajes").insert([
      {
        emisor_id: "id-del-emisor", // Debes obtener el ID del emisor, posiblemente desde el contexto
        receptor_id: "id-del-receptor", // Similar al receptor
        propiedad_id: propiedadId,
        contenido: mensaje,
      },
    ]);

    if (error) {
      console.error("Error al enviar mensaje:", error);
    } else {
      setMensajes([...mensajes, data[0]]);
      setMensaje(""); // Limpiar el campo de mensaje
    }
  };

  if (loading) return <div>Cargando mensajes...</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-semibold">Mensajes</h1>
      <div className="mb-4">
        {mensajes.map((msg) => (
          <div key={msg.id} className="p-2 mb-2 border">
            <p><strong>{msg.emisor_id}</strong>: {msg.contenido}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          className="w-full p-2 border"
          placeholder="Escribe tu mensaje"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 mt-2 text-white bg-blue-600 rounded"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Mensajes;
