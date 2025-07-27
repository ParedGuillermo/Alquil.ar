import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Para obtener el ID desde la URL
import { supabase } from "../supabaseClient"; // Asegúrate de tener la conexión a Supabase

const DonacionDetalles = () => {
  const { id } = useParams(); // Obtenemos el id de la URL
  const [organizacion, setOrganizacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganizacion = async () => {
      try {
        const { data, error } = await supabase
          .from("organizaciones")
          .select("*") // Seleccionamos todos los campos
          .eq("id", id)
          .single(); // `.single()` garantiza que solo recibimos un objeto

        if (error) throw error;

        setOrganizacion(data);
      } catch (error) {
        setError("Error al cargar los detalles de la organización.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizacion();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-t-4 border-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <h2 className="text-xl font-semibold">Algo salió mal</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
      <div className="max-w-3xl p-8 mx-auto bg-white shadow-xl rounded-xl">
        {organizacion ? (
          <>
            {/* Título y logo de la organización */}
            <div className="flex flex-col items-center mb-8">
              <h1 className="mb-4 text-4xl font-bold text-center text-green-800">{organizacion.nombre}</h1>
              {organizacion.logo_url && (
                <div className="flex justify-center mb-6">
                  <img
                    src={organizacion.logo_url}
                    alt={organizacion.nombre}
                    className="object-cover w-32 h-32 rounded-full shadow-lg"
                  />
                </div>
              )}
            </div>

            {/* Descripción de la organización */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Descripción</h2>
              <p className="text-lg text-gray-700">{organizacion.descripcion}</p>
            </div>

            {/* Detalles de contacto */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Contacto</h3>
              <p className="text-lg text-gray-600">{organizacion.contacto}</p>
            </div>

            {/* Ubicación */}
            {organizacion.ubicacion && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Ubicación</h3>
                <p className="text-lg text-gray-600">{organizacion.ubicacion}</p>
              </div>
            )}

            {/* Redes sociales */}
            {organizacion.redes_sociales && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Redes Sociales</h3>
                <p className="text-lg text-gray-600">{organizacion.redes_sociales}</p>
              </div>
            )}

            {/* Fecha de creación */}
            {organizacion.fecha_registro && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Fecha de Creación</h3>
                <p className="text-lg text-gray-600">
                  {new Date(organizacion.fecha_registro).toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Teléfono */}
            {organizacion.telefono && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Teléfono</h3>
                <p className="text-lg text-gray-600">{organizacion.telefono}</p>
              </div>
            )}

            {/* Información adicional */}
            {organizacion.info_adicional && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Información Adicional</h3>
                <p className="text-lg text-gray-600">{organizacion.info_adicional}</p>
              </div>
            )}

            {/* Datos de pago (Código de donación, Link de pago) */}
            {organizacion.codigo_donacion && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Código de Donación</h3>
                <p className="text-lg text-gray-600">{organizacion.codigo_donacion}</p>
              </div>
            )}

            {organizacion.link_pago && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Link de Pago</h3>
                <a
                  href={organizacion.link_pago}
                  className="text-lg text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ir al link de pago
                </a>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-600">No se encontró la organización.</p>
        )}
      </div>
    </div>
  );
};

export default DonacionDetalles;
