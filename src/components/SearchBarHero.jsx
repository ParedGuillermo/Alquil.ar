import React from "react";

const SearchBarHero = () => {
  return (
    <div className="flex flex-col w-full max-w-4xl gap-4 p-4 mx-auto mt-6 shadow-lg bg-white/90 backdrop-blur-md rounded-2xl sm:flex-row">
      <input
        type="text"
        placeholder="¿Dónde buscás?"
        className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none"
      />
      <select className="p-3 border border-gray-300 rounded-xl">
        <option>Tipo</option>
        <option>Casa</option>
        <option>Departamento</option>
        <option>PH</option>
      </select>
      <input
        type="number"
        placeholder="Hasta $"
        className="p-3 border border-gray-300 w-36 rounded-xl"
      />
      <button className="px-6 py-3 text-white transition bg-black rounded-xl hover:bg-gray-800">
        Buscar
      </button>
    </div>
  );
};

export default SearchBarHero;
