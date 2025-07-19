import React from "react";

export default function PropiedadCard({ propiedad, onClick }) {
  return (
    <div
      onClick={onClick}
      className="p-4 transition bg-white rounded-lg shadow cursor-pointer hover:bg-gray-100"
    >
      <h3 className="mb-1 text-lg font-semibold">{propiedad.titulo}</h3>
      <p className="mb-1 text-gray-600">
        Ciudad: {propiedad.ciudad}
      </p>
      <p className="mb-1 text-gray-600">
        Precio: ${propiedad.precio_alquiler.toLocaleString()}
      </p>
      <p className="text-gray-600">
        Tipo: {propiedad.tipo_usuario || "N/A"}
      </p>
    </div>
  );
}

