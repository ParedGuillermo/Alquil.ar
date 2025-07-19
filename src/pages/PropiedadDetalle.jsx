import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function PropiedadDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [propiedad, setPropiedad] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Traer datos propiedad + usuario
  const fetchPropiedad = async () => {
    setLoading(true);

    // Traigo propiedad + usuario (contacto)
    const { data: propData, error: propError } = await supabase
      .from("propiedades")
      .select(`
        *,
        usuario:usuarios (
          nombre,
          email,
          tipo
        )
      `)
      .eq("id", id)
      .single();

    if (propError) {
      setError(propError.message);
      setPropiedad(null);
      setLoading(false);
      return;
    }

    setPropiedad(propData);

    // Traer imágenes relacionadas a la propiedad
    const { data: imgsData, error: imgsError } = await supabase
      .from("imagenes_propiedad")
      .select("url")
      .eq("propiedad_id", id)
      .order("subida_en", { ascending: true });

    if (imgsError) {
      console.error("Error al traer imágenes:", imgsError.message);
      setImagenes([]);
    } else {
      setImagenes(imgsData);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPropiedad();
  }, [id]);

  if (loading) return <p className="p-4">Cargando propiedad...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;
  if (!propiedad) return <p className="p-4">No se encontró la propiedad.</p>;

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 font-semibold text-blue-600 hover:underline"
      >
        ← Volver
      </button>

      <h1 className="mb-4 text-3xl font-bold">{propiedad.titulo}</h1>

      {/* Carousel simple de imágenes */}
      {imagenes.length > 0 ? (
        <div className="flex gap-4 mb-6 overflow-x-auto">
          {imagenes.map(({ url }, i) => {
            // Obtener URL pública de Supabase Storage
            const publicURL = supabase.storage
              .from("images")
              .getPublicUrl(url).publicURL;

            return (
              <img
                key={i}
                src={publicURL}
                alt={`Imagen ${i + 1} de ${propiedad.titulo}`}
                className="flex-shrink-0 object-cover h-48 rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/300x200?text=Sin+imagen";
                }}
              />
            );
          })}
        </div>
      ) : (
        <p className="mb-6 italic text-gray-500">No hay imágenes disponibles.</p>
      )}

      <p className="mb-3 text-gray-700">{propiedad.descripcion}</p>

      <div className="grid grid-cols-2 gap-4 mb-6 text-gray-800">
        <div>
          <strong>Dirección:</strong> <br />
          {propiedad.direccion || "No especificada"}
        </div>
        <div>
          <strong>Ciudad:</strong> <br />
          {propiedad.ciudad || "No especificada"}
        </div>
        <div>
          <strong>Provincia:</strong> <br />
          {propiedad.provincia || "No especificada"}
        </div>
        <div>
          <strong>Precio alquiler:</strong> <br />
          {propiedad.precio
            ? `$${Number(propiedad.precio).toLocaleString()}`
            : "No especificado"}
        </div>
        <div>
          <strong>Habitaciones:</strong> <br />
          {propiedad.habitaciones ?? "No especificado"}
        </div>
        <div>
          <strong>Baños:</strong> <br />
          {propiedad.banos ?? "No especificado"}
        </div>
        <div>
          <strong>Tipo de propiedad:</strong> <br />
          {propiedad.tipo || "Otros"}
        </div>
      </div>

      <div className="p-4 bg-white rounded shadow">
        <h2 className="mb-2 text-lg font-semibold">Contacto</h2>
        <p>
          <strong>Nombre:</strong> {propiedad.usuario?.nombre || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {propiedad.usuario?.email || "N/A"}
        </p>
        <p>
          <strong>Tipo de usuario:</strong> {propiedad.usuario?.tipo || "N/A"}
        </p>
      </div>

      <button
  onClick={() => {
    if (propiedad.usuario?.id) {
      navigate(`/mensajes?usuario_id=${propiedad.usuario.id}`);
    } else {
      alert("No se encontró el contacto de la propiedad.");
    }
  }}
  className="w-full py-3 mt-6 font-semibold text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
>
  Contactar / Mensajes
</button>

    </div>
  );
}
