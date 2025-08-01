import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [propiedades, setPropiedades] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setLoadingProfile(false);
        return;
      }
      setLoadingProfile(true);
      const { data, error } = await supabase
        .from("usuarios")
        .select("nombre, email, verificado")
        .eq("email", user.email)
        .single();
      if (!error) setProfileData(data);
      setLoadingProfile(false);
    }
    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (user) fetchPropiedades();
  }, [user]);

  async function fetchPropiedades() {
    setLoadingProps(true);
    const { data, error } = await supabase
      .from("propiedades")
      .select("*")
      .eq("usuario_id", user.id);
    if (!error) setPropiedades(data);
    setLoadingProps(false);
  }

  async function eliminarPropiedad(id) {
    if (!window.confirm("¿Seguro que quieres eliminar esta propiedad?")) return;

    const { error } = await supabase.from("propiedades").delete().eq("id", id);
    if (error) {
      alert("Error al eliminar la propiedad");
      return;
    }
    fetchPropiedades();
  }

  const estado = profileData?.verificado || "rechazado";
  let estadoTexto = "";
  let mostrarBoton = false;

  switch (estado) {
    case "aprobado":
      estadoTexto = "Verificado ✅";
      mostrarBoton = false;
      break;
    case "pendiente":
      estadoTexto = "Verificación pendiente ⏳";
      mostrarBoton = false;
      break;
    case "rechazado":
    default:
      estadoTexto = "No verificado ❌";
      mostrarBoton = !solicitudEnviada;
      break;
  }

  const solicitarVerificacion = () => {
    navigate("/verification");
  };

  if (!user) return <p className="p-6 text-white">No estás autenticado.</p>;

  return (
    <div className="max-w-4xl min-h-screen p-6 mx-auto bg-background text-textPrimary">
      <h1 className="mb-6 text-4xl font-bold text-white">Perfil</h1>

      {loadingProfile ? (
        <p>Cargando perfil...</p>
      ) : (
        <div className="mb-12">
          <p>
            <strong>Nombre:</strong> {profileData?.nombre || "-"}
          </p>
          <p>
            <strong>Email:</strong> {profileData?.email || "-"}
          </p>
          <p className="mt-4">
            <strong>Estado de verificación: </strong>
            <span>{estadoTexto}</span>
          </p>
          {mostrarBoton && (
            <button
              onClick={solicitarVerificacion}
              className="px-4 py-2 mt-2 font-semibold text-white rounded bg-cyan-600 hover:bg-cyan-700"
            >
              Solicitar verificación
            </button>
          )}
          {!mostrarBoton && estado === "rechazado" && solicitudEnviada && (
            <p className="mt-2 text-sm text-yellow-400">
              Ya enviaste una solicitud de verificación. Espera respuesta.
            </p>
          )}
        </div>
      )}

      {/* CRUD Propiedades */}
      <div className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-white">Mis Propiedades</h2>

        {loadingProps ? (
          <p>Cargando propiedades...</p>
        ) : (
          <>
            <button
              onClick={() => navigate("/cargar-propiedad")}
              className="px-4 py-2 mb-4 font-semibold text-white bg-green-600 rounded hover:bg-green-700"
            >
              + Nueva Propiedad
            </button>

            {propiedades.length === 0 ? (
              <p className="text-white">No tienes propiedades registradas.</p>
            ) : (
              <ul className="mb-8 space-y-2">
                {propiedades.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded"
                  >
                    <div>
                      <strong>{p.titulo}</strong> — {p.tipo} — ${p.precio} — Estado: {p.estado}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/editar-propiedad/${p.id}`)}
                        className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarPropiedad(p.id)}
                        className="px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      <button
        onClick={logout}
        className="px-6 py-3 mt-6 text-white bg-red-600 rounded hover:bg-red-700"
      >
        Cerrar sesión
      </button>
    </div>
  );
}