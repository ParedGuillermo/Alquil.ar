import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

const Verification = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [verificaciones, setVerificaciones] = useState([]);

  // Cargar archivos ya subidos y su estado desde la tabla verificaciones
  useEffect(() => {
    if (!user) return;

    async function fetchVerificaciones() {
      const { data, error } = await supabase
        .from("verificaciones")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al cargar verificaciones:", error.message);
      } else {
        setVerificaciones(data);
      }
    }

    fetchVerificaciones();
  }, [user]);

  // Subir archivo y guardar registro en DB
  const handleFileChange = async (e) => {
    if (!user) return;

    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    // Ruta: carpeta con userId + nombre archivo
    const filePath = `${user.id}/${Date.now()}_${file.name}`;

    const { data, error: uploadError } = await supabase.storage
      .from("documentacion")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      alert("Error al subir archivo: " + uploadError.message);
      setUploading(false);
      return;
    }

    // Guardar referencia en tabla verificaciones
    const { error: dbError } = await supabase.from("verificaciones").insert([
      {
        user_id: user.id,
        documento_tipo: file.name,
        ruta_archivo: filePath,
        estado: "pendiente",
      },
    ]);

    if (dbError) {
      alert("Error al guardar registro de verificación: " + dbError.message);
    } else {
      alert("Archivo subido y registro guardado. Esperá la verificación.");
      // Refrescar lista
      const { data: refreshed, error: err } = await supabase
        .from("verificaciones")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!err) setVerificaciones(refreshed);
    }

    setUploading(false);
  };

  // Generar URL temporal para mostrar el archivo
  const getSignedUrl = async (path) => {
    const { data, error } = await supabase.storage
      .from("documentacion")
      .createSignedUrl(path, 60 * 60); // URL válida 1 hora
    if (error) {
      console.error("Error al obtener URL:", error.message);
      return null;
    }
    return data.signedUrl;
  };

  // Estado para URLs temporales
  const [urls, setUrls] = useState({});

  // Cargar URLs cuando verificaciones cambian
  useEffect(() => {
    async function loadUrls() {
      const newUrls = {};
      for (const v of verificaciones) {
        const url = await getSignedUrl(v.ruta_archivo);
        if (url) newUrls[v.id] = url;
      }
      setUrls(newUrls);
    }
    if (verificaciones.length > 0) loadUrls();
  }, [verificaciones]);

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen p-6 text-white bg-background">
        <p>Para acceder a esta página debes iniciar sesión.</p>
      </div>
    );

  return (
    <div className="max-w-3xl p-6 mx-auto my-12 text-white bg-gray-900 rounded-lg shadow-lg">
      <h1 className="mb-6 text-3xl font-bold">Verificación de Usuario</h1>

      <p className="mb-4 text-gray-400">
        Para poder verificar tu cuenta, subí documentos oficiales (DNI, licencia, etc).
        Nuestro equipo revisará tu documentación y aprobará o rechazará la verificación.
      </p>

      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
        disabled={uploading}
        className="mb-4 text-black"
      />

      {uploading && <p>Cargando archivo...</p>}

      <h2 className="mt-8 mb-4 text-2xl font-semibold">Mis documentos</h2>

      {verificaciones.length === 0 && (
        <p className="text-gray-400">No hay documentos cargados.</p>
      )}

      <ul className="space-y-4">
        {verificaciones.map((v) => (
          <li
            key={v.id}
            className="flex flex-col p-4 bg-gray-800 rounded md:flex-row md:items-center md:justify-between"
          >
            <div className="flex flex-col gap-1">
              <strong>Documento:</strong> {v.documento_tipo}
              <br />
              <strong>Estado:</strong>{" "}
              <span
                className={
                  v.estado === "aprobado"
                    ? "text-green-400 font-semibold"
                    : v.estado === "rechazado"
                    ? "text-red-500 font-semibold"
                    : "text-yellow-400 font-semibold"
                }
              >
                {v.estado.charAt(0).toUpperCase() + v.estado.slice(1)}
              </span>
            </div>
            <div className="mt-2 md:mt-0">
              {urls[v.id] ? (
                v.ruta_archivo.endsWith(".pdf") ? (
                  <a
                    href={urls[v.id]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-sm font-medium underline text-cyan-500"
                  >
                    Ver PDF
                  </a>
                ) : (
                  <img
                    src={urls[v.id]}
                    alt={v.documento_tipo}
                    className="max-w-xs rounded"
                    loading="lazy"
                  />
                )
              ) : (
                <p>Cargando vista previa...</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Verification;
