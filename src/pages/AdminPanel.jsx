import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Tabs, Tab } from "@mui/material";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const AdminPanel = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [usuarios, setUsuarios] = useState([]);
  const [propiedades, setPropiedades] = useState([]);
  const [selectedPropiedad, setSelectedPropiedad] = useState(null);
  const [mapPos, setMapPos] = useState([-27.4678, -58.8345]);

  useEffect(() => {
    getUsuarios();
    getPropiedades();
  }, []);

  const getUsuarios = async () => {
    const { data } = await supabase.from("usuarios").select("*");
    setUsuarios(data || []);
  };

  const getPropiedades = async () => {
    const { data } = await supabase.from("propiedades").select("*");
    setPropiedades(data || []);
  };

  const updateVerificacion = async (userId, status) => {
    await supabase.from("usuarios").update({ verificado: status }).eq("id", userId);
    getUsuarios();
  };

  const updatePropiedad = async () => {
    if (!selectedPropiedad) return;
    const { id, ...rest } = selectedPropiedad;
    await supabase.from("propiedades").update(rest).eq("id", id);
    setSelectedPropiedad(null);
    getPropiedades();
  };

  const handleMapClick = (e) => {
    if (selectedPropiedad) {
      setSelectedPropiedad({
        ...selectedPropiedad,
        latitud: e.latlng.lat,
        longitud: e.latlng.lng,
      });
      setMapPos([e.latlng.lat, e.latlng.lng]);
    }
  };

  return (
    <div className="max-w-screen-xl min-h-screen p-4 mx-auto bg-gray-900">
      <h1 className="mb-6 text-2xl font-bold text-center text-white">Panel de Administración</h1>

      <Tabs
        value={tabIndex}
        onChange={(_, val) => setTabIndex(val)}
        variant="scrollable"
        textColor="inherit"
        className="bg-gray-800 rounded-lg"
        TabIndicatorProps={{ style: { backgroundColor: "#2563eb" } }}
      >
        {["Usuarios", "Propiedades", "Verificación"].map((label, i) => (
          <Tab
            key={label}
            label={label}
            sx={{
              color: tabIndex === i ? "white" : "rgba(255,255,255,0.7)",
              bgcolor: tabIndex === i ? "#2563eb" : "transparent",
              "&:hover": { bgcolor: "#3b82f6", color: "white" },
              fontWeight: "600",
              fontSize: "1rem",
            }}
          />
        ))}
      </Tabs>

      {/* Usuarios */}
      {tabIndex === 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-white border border-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-2 border border-gray-600">Email</th>
                <th className="p-2 border border-gray-600">Verificación</th>
                <th className="p-2 border border-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-t border-gray-700">
                  <td className="p-2 border border-gray-600">{u.email}</td>
                  <td className="p-2 capitalize border border-gray-600">
                    {u.verificado === "aprobado"
                      ? "✅ Verificado"
                      : u.verificado === "pendiente"
                      ? "🕐 Pendiente"
                      : "❌ No verificado"}
                  </td>
                  <td className="p-2 space-x-1 border border-gray-600">
                    <button
                      className="px-2 py-1 transition bg-green-600 rounded hover:bg-green-700"
                      onClick={() => updateVerificacion(u.id, "aprobado")}
                      aria-label="Marcar como verificado"
                    >
                      Verificar
                    </button>
                    <button
                      className="px-2 py-1 transition bg-yellow-500 rounded hover:bg-yellow-600"
                      onClick={() => updateVerificacion(u.id, "pendiente")}
                      aria-label="Marcar como pendiente"
                    >
                      Pendiente
                    </button>
                    <button
                      className="px-2 py-1 transition bg-red-600 rounded hover:bg-red-700"
                      onClick={() => updateVerificacion(u.id, "rechazado")}
                      aria-label="Marcar como no verificado"
                    >
                      Rechazar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Propiedades */}
      {tabIndex === 1 && (
        <div className="mt-4">
          <h2 className="mb-2 font-bold text-white">Listado de Propiedades</h2>
          <table className="w-full mt-4 text-white border border-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-2 border border-gray-600">Título</th>
                <th className="p-2 border border-gray-600">Tipo</th>
                <th className="p-2 border border-gray-600">Estado</th> {/* Nueva columna */}
              </tr>
            </thead>
            <tbody>
              {propiedades.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-gray-700 cursor-pointer hover:bg-gray-700"
                  onClick={() => {
                    setSelectedPropiedad(p);
                    setMapPos([p.latitud || -27.4678, p.longitud || -58.8345]);
                  }}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSelectedPropiedad(p);
                      setMapPos([p.latitud || -27.4678, p.longitud || -58.8345]);
                    }
                  }}
                >
                  <td className="p-2 border border-gray-600">{p.titulo}</td>
                  <td className="p-2 border border-gray-600">{p.tipo}</td>
                  <td className="p-2 capitalize border border-gray-600">{p.estado || "disponible"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedPropiedad && (
            <div className="max-w-3xl mt-4 space-y-4 text-white">
              <h3 className="text-lg font-semibold">Editar Propiedad</h3>

              <label className="block mb-1 font-semibold" htmlFor="titulo">
                Título
              </label>
              <input
                id="titulo"
                type="text"
                placeholder="Título"
                className="w-full p-2 text-white bg-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedPropiedad.titulo}
                onChange={(e) =>
                  setSelectedPropiedad({ ...selectedPropiedad, titulo: e.target.value })
                }
              />

              <label className="block mb-1 font-semibold" htmlFor="descripcion">
                Descripción
              </label>
              <textarea
                id="descripcion"
                placeholder="Descripción"
                className="w-full h-20 p-2 text-white bg-gray-800 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedPropiedad.descripcion}
                onChange={(e) =>
                  setSelectedPropiedad({ ...selectedPropiedad, descripcion: e.target.value })
                }
              />

              <label className="block mb-1 font-semibold" htmlFor="precio">
                Precio
              </label>
              <input
                id="precio"
                type="number"
                placeholder="Precio"
                className="w-full p-2 text-white bg-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedPropiedad.precio}
                onChange={(e) =>
                  setSelectedPropiedad({ ...selectedPropiedad, precio: parseInt(e.target.value) || 0 })
                }
              />

              <label className="block mb-1 font-semibold" htmlFor="direccion">
                Dirección
              </label>
              <input
                id="direccion"
                type="text"
                placeholder="Dirección"
                className="w-full p-2 text-white bg-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedPropiedad.direccion}
                onChange={(e) =>
                  setSelectedPropiedad({ ...selectedPropiedad, direccion: e.target.value })
                }
              />

              <label className="block mb-1 font-semibold" htmlFor="tipo">
                Tipo
              </label>
              <select
                id="tipo"
                className="w-full p-2 text-white bg-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedPropiedad.tipo}
                onChange={(e) =>
                  setSelectedPropiedad({ ...selectedPropiedad, tipo: e.target.value })
                }
              >
                <option value="Departamento">Departamento</option>
                <option value="Casa">Casa</option>
                <option value="Estudio">Estudio</option>
                <option value="Loft">Loft</option>
                <option value="Monoambiente">Monoambiente</option>
              </select>

              <label className="block mt-4 mb-1 font-semibold" htmlFor="gestion">
                Gestión
              </label>
              <select
                id="gestion"
                className="w-full p-2 text-white bg-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedPropiedad.gestion}
                onChange={(e) =>
                  setSelectedPropiedad({ ...selectedPropiedad, gestion: e.target.value })
                }
              >
                <option value="Dueño Directo">Dueño Directo</option>
                <option value="Inmobiliaria">Inmobiliaria</option>
              </select>

              <label className="block mt-4 mb-1 font-semibold" htmlFor="contacto">
                Contacto
              </label>
              <input
                id="contacto"
                type="text"
                placeholder="Contacto"
                className="w-full p-2 text-white bg-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedPropiedad.contacto}
                onChange={(e) =>
                  setSelectedPropiedad({ ...selectedPropiedad, contacto: e.target.value })
                }
              />

              <label className="block mt-4 mb-1 font-semibold" htmlFor="habitaciones">
                Habitaciones
              </label>
              <input
                id="habitaciones"
                type="number"
                placeholder="Habitaciones"
                className="w-full p-2 text-white bg-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedPropiedad.habitaciones}
                onChange={(e) =>
                  setSelectedPropiedad({
                    ...selectedPropiedad,
                    habitaciones: parseInt(e.target.value) || 0,
                  })
                }
              />

              <label className="block mt-4 mb-1 font-semibold" htmlFor="superficie">
                Superficie (m²)
              </label>
              <input
                id="superficie"
                type="number"
                placeholder="Superficie (m²)"
                className="w-full p-2 text-white bg-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedPropiedad.superficie}
                onChange={(e) =>
                  setSelectedPropiedad({
                    ...selectedPropiedad,
                    superficie: parseInt(e.target.value) || 0,
                  })
                }
              />

              <div className="flex flex-wrap gap-4 mt-4">
                <label className="flex items-center gap-2" htmlFor="permiten_mascotas">
                  <input
                    id="permiten_mascotas"
                    type="checkbox"
                    checked={selectedPropiedad.permiten_mascotas}
                    onChange={(e) =>
                      setSelectedPropiedad({ ...selectedPropiedad, permiten_mascotas: e.target.checked })
                    }
                  />
                  Permiten mascotas
                </label>

                <label className="flex items-center gap-2" htmlFor="permiten_ninos">
                  <input
                    id="permiten_ninos"
                    type="checkbox"
                    checked={selectedPropiedad.permiten_ninos}
                    onChange={(e) =>
                      setSelectedPropiedad({ ...selectedPropiedad, permiten_ninos: e.target.checked })
                    }
                  />
                  Permiten niños
                </label>

                <label className="flex items-center gap-2" htmlFor="servicios_incluidos">
                  <input
                    id="servicios_incluidos"
                    type="checkbox"
                    checked={selectedPropiedad.servicios_incluidos}
                    onChange={(e) =>
                      setSelectedPropiedad({ ...selectedPropiedad, servicios_incluidos: e.target.checked })
                    }
                  />
                  Servicios incluidos
                </label>

                <label className="flex items-center gap-2" htmlFor="amoblado">
                  <input
                    id="amoblado"
                    type="checkbox"
                    checked={selectedPropiedad.amoblado}
                    onChange={(e) =>
                      setSelectedPropiedad({ ...selectedPropiedad, amoblado: e.target.checked })
                    }
                  />
                  Amoblado
                </label>
              </div>

              <label className="block mt-4 mb-1 font-semibold" htmlFor="fecha_ingreso">
                Fecha de ingreso
              </label>
              <input
                id="fecha_ingreso"
                type="date"
                className="w-full p-2 text-white bg-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={
                  selectedPropiedad.fecha_ingreso
                    ? selectedPropiedad.fecha_ingreso.split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setSelectedPropiedad({ ...selectedPropiedad, fecha_ingreso: e.target.value })
                }
              />

              {/* Aquí agrego el select para Estado */}
              <label className="block mt-4 mb-1 font-semibold" htmlFor="estado">
                Estado
              </label>
              <select
                id="estado"
                className="w-full p-2 text-white bg-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedPropiedad.estado || "disponible"}
                onChange={(e) =>
                  setSelectedPropiedad({ ...selectedPropiedad, estado: e.target.value })
                }
              >
                <option value="disponible">Disponible</option>
                <option value="alquilada">Alquilada</option>
              </select>

              <label className="block mt-4 mb-1 font-semibold">Ubicación en el mapa</label>
              <MapContainer
                center={mapPos}
                zoom={13}
                style={{ height: "300px", width: "100%" }}
                whenCreated={(map) => {
                  map.on("click", handleMapClick);
                }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={[selectedPropiedad.latitud || -27.4678, selectedPropiedad.longitud || -58.8345]} />
              </MapContainer>

              <button
                onClick={async () => {
                  if (!selectedPropiedad) return;
                  await supabase.from("propiedades").delete().eq("id", selectedPropiedad.id);
                  setSelectedPropiedad(null);
                  getPropiedades();
                }}
                className="w-full py-2 mt-3 font-semibold transition bg-red-600 rounded hover:bg-red-700"
                aria-label="Eliminar propiedad"
              >
                Eliminar Propiedad
              </button>

              <button
                onClick={updatePropiedad}
                className="w-full py-2 mt-3 font-semibold transition bg-blue-600 rounded hover:bg-blue-700"
              >
                Guardar Cambios
              </button>
            </div>
          )}
        </div>
      )}

      {/* Verificación */}
      {tabIndex === 2 && (
        <div className="mt-4 text-white">
          <h2 className="mb-2 font-bold">Documentación de Verificación</h2>
          <ul className="space-y-2 overflow-auto max-h-64">
            {usuarios.filter((u) => u.verificado === "pendiente").length === 0 && (
              <p>No hay usuarios pendientes de verificación.</p>
            )}
            {usuarios
              .filter((u) => u.verificado === "pendiente")
              .map((u) => (
                <li
                  key={u.id}
                  className="flex items-center justify-between p-2 bg-gray-800 rounded"
                >
                  <span>{u.email}</span>
                  <a
                    href={`https://tu-bucket-url/documentacion/${u.id}/`} // Cambiar a tu URL real
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline"
                    aria-label={`Ver documentación de ${u.email}`}
                  >
                    Ver Documentación
                  </a>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
