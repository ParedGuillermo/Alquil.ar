import React from "react";

export default function ChatMessage({ mensaje, esPropio }) {
  return (
    <div
      className={`max-w-xs px-4 py-2 rounded-lg mb-2 ${
        esPropio ? "bg-blue-600 text-white self-end" : "bg-gray-200 text-gray-900 self-start"
      }`}
    >
      <p>{mensaje.texto}</p>
      <span className="block mt-1 text-xs text-right opacity-70">
        {new Date(mensaje.fecha_envio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}
