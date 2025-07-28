import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Solución icono marker default para leaflet + React (arregla icono roto)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LocationMarker = ({ position, setPosition }) => {
  // Hook para detectar click y mover marcador
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  if (!position) return null;

  return (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const newPos = marker.getLatLng();
          setPosition(newPos);
        },
      }}
    />
  );
};

const AdminPanel = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [propiedades, setPropiedades] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editingProp, setEditingProp] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: usuariosData, error: usuariosError } = await supabase
        .from("usuarios")
        .select("*");
      if (usuariosError) {
        alert("Error cargando usuarios: " + usuariosError.message);
        return;
      }

      const { data: propiedadesData, error: propError } = await supabase
        .from("propiedades")
        .select("*");

      if (propError) {
        alert("Error cargando propiedades: " + propError.message);
        return;
      }

      // Convertir paths de imágenes a URLs públicas
      const propiedadesConUrls = propiedadesData.map((p) => {
        if (p.imagenes && Array.isArray(p.imagenes)) {
          const imagenesPublicas = p.imagenes.map((path) => {
            const { data } = supabase.storage.from("images").getPublicUrl(path);
            return data.publicUrl;
          });
          return { ...p, imagenes: imagenesPublicas };
        }
        return p;
      });

      setUsuarios(usuariosData || []);
      setPropiedades(propiedadesConUrls || []);
    };

    fetchData();
  }, []);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePropChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingProp((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Actualiza latitud/longitud desde el mapa
  const setPosition = (latlng) => {
    setEditingProp((prev) => ({
      ...prev,
      latitud: latlng.lat,
      longitud: latlng.lng,
    }));
  };

  const saveUser = async () => {
    if (!editingUser) return;
    const { error } = await supabase
      .from("usuarios")
      .update(editingUser)
      .eq("id", editingUser.id);
    if (error) {
      alert("Error al actualizar usuario: " + error.message);
      return;
    }
    setUsuarios((prev) =>
      prev.map((u) => (u.id === editingUser.id ? editingUser : u))
    );
    setEditingUser(null);
  };

  const saveProp = async () => {
    if (!editingProp) return;

    setLoading(true);

    // Convertir URLs públicas a paths para guardar
    const imagenesPaths = (editingProp.imagenes || []).map((url) => {
      try {
        const urlObj = new URL(url);
        const index = urlObj.pathname.indexOf("/images/");
        if (index === -1) return url;
        return urlObj.pathname.slice(index + "/images/".length);
      } catch {
        return url;
      }
    });

    const propToSave = { ...editingProp, imagenes: imagenesPaths };

    const { error } = await supabase
      .from("propiedades")
      .update(propToSave)
      .eq("id", editingProp.id);

    if (error) {
      alert("Error al actualizar propiedad: " + error.message);
      setLoading(false);
      return;
    }
    setPropiedades((prev) =>
      prev.map((p) =>
        p.id === editingProp.id
          ? { ...propToSave, imagenes: editingProp.imagenes }
          : p
      )
    );
    setEditingProp(null);
    setLoading(false);
  };

  const deletePropiedad = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro que querés eliminar esta propiedad?"
    );
    if (!confirmar) return;

    const { error } = await supabase.from("propiedades").delete().eq("id", id);
    if (error) {
      alert("Error al eliminar propiedad: " + error.message);
    } else {
      setPropiedades((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleUploadImage = async (event) => {
    if (!editingProp) return;
    const file = event.target.files[0];
    if (!file) return;

    if ((editingProp.imagenes?.length || 0) >= 5) {
      alert("No podés subir más de 5 imágenes");
      return;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${editingProp.id}_${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(fileName, file, { upsert: false });

    if (error) {
      alert("Error al subir la imagen: " + error.message);
      return;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(fileName);

    setEditingProp((prev) => ({
      ...prev,
      imagenes: [...(prev.imagenes || []), data.publicUrl].slice(0, 5),
    }));

    event.target.value = null;
  };

  return (
    <div className="min-h-screen p-6 text-white bg-neutral-900">
      <h1 className="mb-6 text-3xl font-bold text-center">Panel de Administración</h1>

      {/* Usuarios */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Usuarios</h2>
        <div className="grid gap-4">
          {usuarios.map((user) =>
            editingUser?.id === user.id ? (
              <div key={user.id} className="p-4 bg-neutral-800 rounded-xl">
                <label className="block mb-1 font-semibold" htmlFor="nombre">
                  Nombre
                </label>
                <input
                  id="nombre"
                  className="w-full p-2 mb-2 text-white rounded bg-neutral-700"
                  name="nombre"
                  value={editingUser.nombre || ""}
                  onChange={handleUserChange}
                  placeholder="Nombre"
                />
                <label className="block mb-1 font-semibold" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  className="w-full p-2 mb-2 text-white rounded bg-neutral-700"
                  name="email"
                  value={editingUser.email || ""}
                  onChange={handleUserChange}
                  placeholder="Email"
                />
                <label className="block mb-1 font-semibold" htmlFor="tipo">
                  Tipo
                </label>
                <select
                  id="tipo"
                  className="w-full p-2 mb-2 text-white rounded bg-neutral-700"
                  name="tipo"
                  value={editingUser.tipo || ""}
                  onChange={handleUserChange}
                >
                  <option value="locatario">Locatario</option>
                  <option value="locador">Locador</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  onClick={saveUser}
                  className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 ml-2 bg-gray-600 rounded hover:bg-gray-700"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-neutral-800 rounded-xl"
              >
                <div>
                  <p>
                    <strong>{user.nombre || "Sin nombre"}</strong> -{" "}
                    {user.email || "Sin email"} ({user.tipo || "Sin tipo"})
                  </p>
                </div>
                <button
                  onClick={() => setEditingUser(user)}
                  className="px-3 py-1 text-sm bg-blue-600 rounded hover:bg-blue-700"
                >
                  Editar
                </button>
              </div>
            )
          )}
        </div>
      </section>

      {/* Propiedades */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Propiedades</h2>
        <div className="grid gap-4">
          {propiedades.map((prop) =>
            editingProp?.id === prop.id ? (
              <div key={prop.id} className="p-4 space-y-3 bg-neutral-800 rounded-xl">
                <label className="block font-semibold" htmlFor="titulo">
                  Título
                </label>
                <input
                  id="titulo"
                  className="w-full p-2 text-white rounded bg-neutral-700"
                  name="titulo"
                  value={editingProp.titulo || ""}
                  onChange={handlePropChange}
                  placeholder="Título"
                />

                <label className="block font-semibold" htmlFor="descripcion">
                  Descripción
                </label>
                <input
                  id="descripcion"
                  className="w-full p-2 text-white rounded bg-neutral-700"
                  name="descripcion"
                  value={editingProp.descripcion || ""}
                  onChange={handlePropChange}
                  placeholder="Descripción"
                />

                <label className="block font-semibold" htmlFor="precio">
                  Precio
                </label>
                <input
                  id="precio"
                  className="w-full p-2 text-white rounded bg-neutral-700"
                  name="precio"
                  type="number"
                  value={editingProp.precio || ""}
                  onChange={handlePropChange}
                  placeholder="Precio"
                />

                <label className="block font-semibold" htmlFor="direccion">
                  Dirección
                </label>
                <input
                  id="direccion"
                  className="w-full p-2 text-white rounded bg-neutral-700"
                  name="direccion"
                  value={editingProp.direccion || ""}
                  onChange={handlePropChange}
                  placeholder="Dirección"
                />

                {/* Imágenes */}
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">
                    Imágenes (máximo 5):
                  </label>
                  <div className="flex flex-wrap gap-4 mb-2">
                    {(editingProp.imagenes || []).map((url, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={url}
                          alt={`Imagen ${idx + 1}`}
                          className="object-cover w-24 h-24 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const nuevasImagenes = editingProp.imagenes.filter(
                              (_, i) => i !== idx
                            );
                            setEditingProp((prev) => ({
                              ...prev,
                              imagenes: nuevasImagenes,
                            }));
                          }}
                          className="absolute top-0 right-0 p-1 text-white bg-red-600 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-700"
                          aria-label={`Eliminar imagen ${idx + 1}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  {(editingProp.imagenes?.length || 0) < 5 && (
                    <>
                      <label className="block w-full max-w-xs px-3 py-2 mb-2 text-center bg-blue-600 rounded cursor-pointer hover:bg-blue-700">
                        Subir imagen desde PC
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUploadImage}
                          className="hidden"
                        />
                      </label>

                      <label
                        htmlFor="newImageUrl"
                        className="block mt-2 mb-1 font-semibold"
                      >
                        Agregar URL de imagen
                      </label>
                      <input
                        id="newImageUrl"
                        type="text"
                        placeholder="Nueva URL de imagen"
                        className="w-full p-2 text-white rounded bg-neutral-700"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const url = e.target.value.trim();
                            if (url) {
                              setEditingProp((prev) => ({
                                ...prev,
                                imagenes: [...(prev.imagenes || []), url].slice(
                                  0,
                                  5
                                ),
                              }));
                              e.target.value = "";
                            }
                          }
                        }}
                      />
                    </>
                  )}
                </div>

                <label className="block font-semibold" htmlFor="tipo">
                  Tipo (Departamento, Casa, etc.)
                </label>
                <input
                  id="tipo"
                  className="w-full p-2 text-white rounded bg-neutral-700"
                  name="tipo"
                  value={editingProp.tipo || ""}
                  onChange={handlePropChange}
                  placeholder="Tipo (Departamento, Casa, etc.)"
                />

                <label className="block font-semibold" htmlFor="gestion">
                  Gestión (Dueño Directo, Inmobiliaria)
                </label>
                <input
                  id="gestion"
                  className="w-full p-2 text-white rounded bg-neutral-700"
                  name="gestion"
                  value={editingProp.gestion || ""}
                  onChange={handlePropChange}
                  placeholder="Gestión (Dueño Directo, Inmobiliaria)"
                />

                <label className="block font-semibold" htmlFor="contacto">
                  Contacto
                </label>
                <input
                  id="contacto"
                  className="w-full p-2 text-white rounded bg-neutral-700"
                  name="contacto"
                  value={editingProp.contacto || ""}
                  onChange={handlePropChange}
                  placeholder="Contacto"
                />

                <label className="block font-semibold" htmlFor="habitaciones">
                  Habitaciones
                </label>
                <input
                  id="habitaciones"
                  className="w-full p-2 text-white rounded bg-neutral-700"
                  name="habitaciones"
                  type="number"
                  value={editingProp.habitaciones || ""}
                  onChange={handlePropChange}
                  placeholder="Habitaciones"
                />

                <label className="block font-semibold" htmlFor="superficie">
                  Superficie (m²)
                </label>
                <input
                  id="superficie"
                  className="w-full p-2 text-white rounded bg-neutral-700"
                  name="superficie"
                  type="number"
                  value={editingProp.superficie || ""}
                  onChange={handlePropChange}
                  placeholder="Superficie (m²)"
                />

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="permiten_mascotas"
                    checked={!!editingProp.permiten_mascotas}
                    onChange={handlePropChange}
                  />
                  Permiten mascotas
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="permiten_ninos"
                    checked={!!editingProp.permiten_ninos}
                    onChange={handlePropChange}
                  />
                  Permiten niños
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="servicios_incluidos"
                    checked={!!editingProp.servicios_incluidos}
                    onChange={handlePropChange}
                  />
                  Servicios incluidos
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="amoblado"
                    checked={!!editingProp.amoblado}
                    onChange={handlePropChange}
                  />
                  Amoblado
                </label>

                <label className="block font-semibold" htmlFor="fecha_ingreso">
                  Fecha ingreso
                </label>
                <input
                  id="fecha_ingreso"
                  className="w-full p-2 text-white rounded bg-neutral-700"
                  name="fecha_ingreso"
                  type="date"
                  value={
                    editingProp.fecha_ingreso
                      ? new Date(editingProp.fecha_ingreso)
                          .toISOString()
                          .substr(0, 10)
                      : ""
                  }
                  onChange={handlePropChange}
                  placeholder="Fecha ingreso"
                />

                {/* Mapa para corregir ubicación */}
                <label className="block mt-4 mb-2 font-semibold">
                  Ubicación (click o arrastrar marcador)
                </label>
                <div className="h-64 overflow-hidden rounded-lg">
                  <MapContainer
                    center={[
                      editingProp.latitud || -27.4738,
                      editingProp.longitud || -58.8323,
                    ]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker
                      position={{
                        lat: editingProp.latitud || -27.4738,
                        lng: editingProp.longitud || -58.8323,
                      }}
                      setPosition={setPosition}
                    />
                  </MapContainer>
                </div>

                <label className="block mt-4 font-semibold" htmlFor="latitud">
                  Latitud
                </label>
                <input
                  id="latitud"
                  className="w-full p-2 text-white rounded bg-neutral-700"
                  name="latitud"
                  type="number"
                  step="any"
                  value={editingProp.latitud || ""}
                  onChange={handlePropChange}
                  placeholder="Latitud"
                />

                <label className="block font-semibold" htmlFor="longitud">
                  Longitud
                </label>
                <input
                  id="longitud"
                  className="w-full p-2 text-white rounded bg-neutral-700"
                  name="longitud"
                  type="number"
                  step="any"
                  value={editingProp.longitud || ""}
                  onChange={handlePropChange}
                  placeholder="Longitud"
                />

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={saveProp}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? "Guardando..." : "Guardar"}
                  </button>
                  <button
                    onClick={() => setEditingProp(null)}
                    className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={prop.id}
                className="flex items-center justify-between p-4 bg-neutral-800 rounded-xl"
              >
                <div>
                  <p>
                    <strong>{prop.titulo || "Sin título"}</strong> -{" "}
                    {prop.direccion || "Sin dirección"} - ${prop.precio || "0"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingProp(prop)}
                    className="px-3 py-1 text-sm bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deletePropiedad(prop.id)}
                    className="px-3 py-1 text-sm bg-red-600 rounded hover:bg-red-700"
                    aria-label={`Eliminar propiedad ${prop.titulo}`}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
