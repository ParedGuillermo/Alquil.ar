import React from "react";
import { useAuth } from "../context/AuthContext";

const ChatMessage = ({ mensaje }) => {
  const { user } = useAuth();
  const esPropio = mensaje.emisor_id === user.id;

  return (
    <div
      className={`flex mb-2 ${
        esPropio ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${
          esPropio ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-800"
        }`}
      >
        <p>{mensaje.contenido}</p>
        <small className="block mt-1 text-xs text-right text-gray-600">
          {new Date(mensaje.creado_en).toLocaleTimeString()}
        </small>
      </div>
    </div>
  );
};

export default ChatMessage;
