import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdministrarQR() {
  const [mascotas, setMascotas] = useState([]);
  const [codigosQR, setCodigosQR] = useState([]);
  const [codigosUsados, setCodigosUsados] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState("");
  const [codigoSeleccionado, setCodigoSeleccionado] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Mascotas
        const { data: mascotasData, error: errorMascotas } = await supabase
          .from("mascotas")
          .select("*");
        if (errorMascotas) throw errorMascotas;
        setMascotas(mascotasData || []);

        // Códigos QR
        const { data: codigosData, error: errorCodigos } = await supabase
          .storage
          .from("productos")
          .list("codigos-qr", { limit: 100 });
        if (errorCodigos) throw errorCodigos;
        setCodigosQR(codigosData || []);

        // Códigos usados
        const usados = (mascotasData || [])
          .map((m) => m.codigo_qr_url)
          .filter((c) => c && c.trim() !== "");
        setCodigosUsados(usados);
      } catch (error) {
        console.error("Error al cargar datos:", error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAsignarQR = async () => {
    if (!mascotaSeleccionada || !codigoSeleccionado) {
      alert("Debes seleccionar una mascota y un código QR");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("mascotas")
        .update({ codigo_qr_url: codigoSeleccionado })
        .eq("id", mascotaSeleccionada);
      if (error) throw error;

      alert("Código QR asignado correctamente");
      setMascotaSeleccionada("");
      setCodigoSeleccionado("");

      // Refrescar mascotas y códigos usados
      const { data: mascotasActualizadas, error: errorMascotas } = await supabase
        .from("mascotas")
        .select("*");
      if (errorMascotas) throw errorMascotas;
      setMascotas(mascotasActualizadas || []);

      const usados = (mascotasActualizadas || [])
        .map((m) => m.codigo_qr_url)
        .filter((c) => c && c.trim() !== "");
      setCodigosUsados(usados);
    } catch (error) {
      alert("Error al asignar código QR: " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const codigosDisponibles = codigosQR.filter(
    (codigo) => !codigosUsados.includes(codigo.name)
  );

  const mascotasConQR = mascotas.filter(
    (m) => m.codigo_qr_url && m.codigo_qr_url.trim() !== ""
  );

  return (
    <div className="min-h-screen p-6 pb-24 bg-purple-50">
      <h1 className="mb-6 text-3xl font-bold text-center text-purple-800">
        Asignar Código QR a Mascota
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Cargando datos...</p>
      ) : (
        <>
          <div className="max-w-md mx-auto space-y-6">
            {/* Selección de mascota */}
            <div>
              <label
                htmlFor="mascota-select"
                className="block mb-2 text-lg font-semibold text-purple-700"
              >
                Selecciona una mascota
              </label>
              <select
                id="mascota-select"
                value={mascotaSeleccionada}
                onChange={(e) => setMascotaSeleccionada(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="">Seleccionar mascota</option>
                {mascotas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Selección de código QR */}
            <div>
              <label
                htmlFor="codigo-select"
                className="block mb-2 text-lg font-semibold text-purple-700"
              >
                Selecciona un código QR
              </label>
              <select
                id="codigo-select"
                value={codigoSeleccionado}
                onChange={(e) => setCodigoSeleccionado(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="">Seleccionar código QR</option>
                {codigosDisponibles.length === 0 && (
                  <option disabled>No hay códigos QR disponibles</option>
                )}
                {codigosDisponibles.map((codigo) => (
                  <option key={codigo.name} value={codigo.name}>
                    {codigo.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón para asignar */}
            <button
              onClick={handleAsignarQR}
              disabled={!mascotaSeleccionada || !codigoSeleccionado || loading}
              className={`w-full px-6 py-3 text-white rounded ${
                !mascotaSeleccionada || !codigoSeleccionado || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition`}
              aria-disabled={!mascotaSeleccionada || !codigoSeleccionado || loading}
            >
              {loading ? "Procesando..." : "Asignar Código QR"}
            </button>
          </div>

          {/* Mostrar códigos asignados */}
          <section className="max-w-5xl mx-auto mt-12">
            <h2 className="mb-6 text-2xl font-bold text-purple-800">
              Códigos QR asignados
            </h2>

            {mascotasConQR.length === 0 ? (
              <p className="text-center text-gray-600">
                No hay códigos QR asignados todavía.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {mascotasConQR.map((mascota) => (
                  <div
                    key={mascota.id}
                    className="flex flex-col items-center p-4 bg-white rounded shadow"
                  >
                    <h3 className="mb-2 text-lg font-semibold text-center text-purple-700">
                      {mascota.nombre}
                    </h3>
                    <img
                      src={`https://zcoekpdxfbnooopsrrec.supabase.co/storage/v1/object/public/productos/codigos-qr/${mascota.codigo_qr_url}`}
                      alt={`QR de ${mascota.nombre}`}
                      className="rounded w-28 h-28"
                      loading="lazy"
                    />
                    <p className="max-w-full mt-2 text-sm text-gray-500 truncate">
                      {mascota.codigo_qr_url}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
