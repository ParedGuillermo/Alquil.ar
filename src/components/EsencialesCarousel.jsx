import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function EsencialesCarousel() {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("categoria", "esenciales")
        .limit(10);
      if (error) console.error("Error productos:", error.message);
      else setProductos(data);
    };
    fetchProductos();
  }, []);

  const handleNavigate = (id) => {
    navigate(`/productos/${id}`);
  };

  return (
    <section aria-label="Productos Esenciales">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Productos Esenciales</h2>
        <button
          onClick={() => navigate("/productos")}
          className="text-sm text-blue-600 hover:underline focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          Ver más →
        </button>
      </div>

      <div
        className="flex pb-2 space-x-4 overflow-x-auto"
        role="list"
        aria-label="Listado de productos esenciales"
      >
        {productos.map((p) => (
          <article
            key={p.id}
            role="listitem"
            tabIndex={0}
            onClick={() => handleNavigate(p.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleNavigate(p.id);
            }}
            className="min-w-[160px] bg-white shadow rounded-lg p-3 cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <img
              src={p.foto_url || "/placeholder-image.png"}
              alt={p.nombre}
              className="object-cover w-full mb-2 rounded h-28"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-image.png";
              }}
            />
            <p className="text-sm font-semibold">{p.nombre}</p>
            <p className="text-xs text-gray-500">
              ${Number(p.precio).toFixed(2)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
