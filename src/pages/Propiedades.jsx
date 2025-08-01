import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const TIPOS = ["Departamento", "Casa", "Estudio", "Loft", "Monoambiente"];
const GESTIONES = ["Dueño Directo", "Inmobiliaria"];

const Propiedades = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [filtros, setFiltros] = useState({
    tipo: "",
    gestion: "",
    precioMin: "",
    precioMax: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPropiedades = async () => {
      const { data, error } = await supabase
        .from("propiedades")
        .select(`
          *,
          usuario:usuario_id (
            nombre,
            verificado
          )
        `);
      if (error) {
        console.error("Error al traer propiedades:", error);
        return;
      }
      setPropiedades(data);
    };
    fetchPropiedades();
  }, []);

  // Filtrar propiedades en frontend
  const propiedadesFiltradas = propiedades.filter((prop) => {
    if (filtros.tipo && prop.tipo !== filtros.tipo) return false;
    if (filtros.gestion && prop.gestion !== filtros.gestion) return false;
    if (filtros.precioMin && prop.precio < Number(filtros.precioMin)) return false;
    if (filtros.precioMax && prop.precio > Number(filtros.precioMax)) return false;
    return true;
  });

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const resetFiltros = () => {
    setFiltros({ tipo: "", gestion: "", precioMin: "", precioMax: "" });
  };

  // Componente Carrusel para mostrar imágenes
  const Carousel = ({ images }) => {
    const [index, setIndex] = useState(0);
    const timeoutRef = useRef(null);

    React.useEffect(() => {
      if (!images || images.length <= 1) return;
      timeoutRef.current = setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 4000);
      return () => clearTimeout(timeoutRef.current);
    }, [index, images]);

    if (!images || images.length === 0) {
      return (
        <div className="flex items-center justify-center h-48 text-gray-500 bg-gray-300 rounded-t-2xl">
          Sin imagen
        </div>
      );
    }

    return (
      <div className="relative h-48 overflow-hidden rounded-t-2xl">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Imagen ${i + 1}`}
            className={`absolute top-0 left-0 w-full h-48 object-cover transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
          />
        ))}
        {/* Botones manuales */}
        <div className="absolute flex gap-2 -translate-x-1/2 bottom-2 left-1/2">
          {images.map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full ${
                i === index ? "bg-white" : "bg-gray-400"
              }`}
              onClick={() => setIndex(i)}
              aria-label={`Mostrar imagen ${i + 1}`}
              type="button"
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen px-4 py-6 bg-background text-textPrimary">
      <h1 className="mb-6 text-3xl font-bold text-center text-textPrimary">
        Propiedades disponibles
      </h1>

      {/* Filtros */}
      <div className="grid max-w-5xl gap-4 mx-auto mb-8 sm:grid-cols-2 md:grid-cols-4">
        {/* Tipo */}
        <select
          name="tipo"
          value={filtros.tipo}
          onChange={handleFiltroChange}
          className="p-2 text-white bg-gray-800 rounded focus:outline-cyan-500"
          aria-label="Filtrar por tipo"
        >
          <option value="">Tipo (todos)</option>
          {TIPOS.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>

        {/* Gestión */}
        <select
          name="gestion"
          value={filtros.gestion}
          onChange={handleFiltroChange}
          className="p-2 text-white bg-gray-800 rounded focus:outline-cyan-500"
          aria-label="Filtrar por gestión"
        >
          <option value="">Gestión (todas)</option>
          {GESTIONES.map((gestion) => (
            <option key={gestion} value={gestion}>
              {gestion}
            </option>
          ))}
        </select>

        {/* Precio mínimo */}
        <input
          type="number"
          name="precioMin"
          value={filtros.precioMin}
          onChange={handleFiltroChange}
          placeholder="Precio mínimo"
          className="p-2 text-white bg-gray-800 rounded focus:outline-cyan-500"
          min={0}
          aria-label="Precio mínimo"
        />

        {/* Precio máximo */}
        <input
          type="number"
          name="precioMax"
          value={filtros.precioMax}
          onChange={handleFiltroChange}
          placeholder="Precio máximo"
          className="p-2 text-white bg-gray-800 rounded focus:outline-cyan-500"
          min={0}
          aria-label="Precio máximo"
        />
      </div>

      <div className="flex justify-end max-w-5xl mx-auto mb-6">
        <button
          onClick={resetFiltros}
          className="px-4 py-2 text-sm font-semibold bg-gray-800 rounded text-cyan-600 hover:bg-gray-700"
        >
          Limpiar filtros
        </button>
      </div>

      {/* Listado filtrado */}
      <div className="grid max-w-5xl gap-6 mx-auto md:grid-cols-2 lg:grid-cols-3">
        {propiedadesFiltradas.length === 0 && (
          <p className="text-center text-gray-400 col-span-full">
            No hay propiedades que coincidan con los filtros.
          </p>
        )}

        {propiedadesFiltradas.map((prop) => {
          const propietario = prop.usuario || { nombre: "Desconocido", verificado: false };

          return (
            <div
              key={prop.id}
              className="flex flex-col bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-cyan-600 cursor-pointer"
              onClick={() => navigate(`/propiedad/${prop.id}`)}
            >
              <Carousel images={prop.imagen_url || []} />

              <div className="flex flex-col flex-grow p-4">
                <h2 className="mb-1 text-xl font-semibold text-white truncate">
                  {prop.titulo}
                </h2>
                <p className="mb-2 truncate text-cyan-400">{prop.direccion}</p>
                <p className="flex items-center gap-2 mb-2 text-sm text-gray-400">
                  Dueño: {propietario.nombre}
                  {propietario.verificado && (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded bg-cyan-600 text-white select-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Verificado
                    </span>
                  )}
                </p>
                <p className="mb-4 text-sm text-gray-300 line-clamp-2">
                  {prop.descripcion}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/propiedad/${prop.id}`);
                  }}
                  className="py-2 mt-auto text-white transition rounded-lg bg-cyan-600 hover:bg-cyan-700"
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Propiedades;
