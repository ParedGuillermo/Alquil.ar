import React from "react";

const filtros = ["Casa", "Depto", "PH", "Monoambiente", "Hasta $100K", "Acepta Mascotas"];

const FiltroPersistente = () => {
  return (
    <div className="sticky top-0 z-10 flex gap-3 px-4 py-2 overflow-x-auto bg-white shadow-sm whitespace-nowrap">
      {filtros.map((filtro, index) => (
        <button
          key={index}
          className="px-4 py-2 text-sm bg-gray-100 rounded-full hover:bg-gray-200"
        >
          {filtro}
        </button>
      ))}
    </div>
  );
};

export default FiltroPersistente;
