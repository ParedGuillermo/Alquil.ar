import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AdminPanel = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [propiedades, setPropiedades] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editingProp, setEditingProp] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: usuariosData } = await supabase.from("usuarios").select("*");
      const { data: propiedadesData } = await supabase.from("propiedades").select("*");
      setUsuarios(usuariosData || []);
      setPropiedades(propiedadesData || []);
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

  const saveUser = async () => {
    const { error } = await supabase.from("usuarios").update(editingUser).eq("id", editingUser.id);
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
    // Asegurate que editingProp.imagenes sea array antes de guardar
    const propToSave = {
      ...editingProp,
      imagenes: editingProp.imagenes || [],
    };
    const { error } = await supabase.from("propiedades").update(propToSave).eq("id", editingProp.id);
    if (error) {
      alert("Error al actualizar propiedad: " + error.message);
      return;
    }
    setPropiedades((prev) =>
      prev.map((p) => (p.id === editingProp.id ? propToSave : p))
    );
    setEditingProp(null);
  };

  const deletePropiedad = async (id) => {
    const confirmar = window.confirm("¿Estás seguro que querés eliminar esta propiedad?");
    if (!confirmar) return;

    const { error } = await supabase.from("propiedades").delete().eq("id", id);
    if (error) {
      alert("Error al eliminar propiedad: " + error.message);
    } else {
      setPropiedades((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen p-6 text-white bg-neutral-900">
      <h1 className="mb-6 text-3xl font-bold text-center">Panel de Administración</h1>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Usuarios</h2>
        <div className="grid gap-4">
          {usuarios.map((user) =>
            editingUser?.id === user.id ? (
              <div key={user.id} className="p-4 bg-neutral-800 rounded-xl">
                <input
                  className="w-full p-2 mb-2 text-white rounded bg-neutral-700"
                  name="nombre"
                  value={editingUser.nombre || ""}
                  onChange={handleUserChange}
                  placeholder="Nombre"
                />
                <input
                  className="w-full p-2 mb-2 text-white rounded bg-neutral-700"
                  name="email"
                  value={editingUser.email || ""}
                  onChange={handleUserChange}
                  placeholder="Email"
                />
                <select
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
                    <strong>{user.nombre || "Sin nombre"}</strong> - {user.email || "Sin email"} ({user.tipo || "Sin tipo"})
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

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Propiedades</h2>
        <div className="grid gap-4">
          {propiedades.map((prop) =>
            editingProp?.id === prop.id ? (
              <div key={prop.id} className="p-4 space-y-2 bg-neutral-800 rounded-xl">
                <input
                  className="w-full p-2 text-white rounded bg-neutral-700"
                  name="titulo"
                  value={editingProp.titulo || ""}
                  onChange={handlePropChange}
                  placeholder="Título"
                />
                <input
                  className="w-full p-2 text-white rounded bg-neutral-700"
                  name="descripcion"
                  value={editingProp.descripcion || ""}
                  onChange={handlePropChange}
                  placeholder="Descripción"
                />
                <input
                  className="w-full p-2 text-white rounded bg-neutral-700"
                  name="precio"
                  type="number"
                  value={editingProp.precio || ""}
                  onChange={handlePropChange}
                  placeholder="Precio"
                />
                <input
                  className="w-full p-2 text-white rounded bg-neutral-700"
                  name="direccion"
                  value={editingProp.direccion || ""}
                  onChange={handlePropChange}
                  placeholder="Dirección"
                />

                {/* Imágenes */}
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">Imágenes (máximo 5):</label>
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
                            const nuevasImagenes = editingProp.imagenes.filter((_, i) => i !== idx);
                            setEditingProp(prev => ({ ...prev, imagenes: nuevasImagenes }));
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
                    <input
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
                              imagenes: [...(prev.imagenes || []), url].slice(0, 5),
                            }));
                            e.target.value = "";
                          }
                        }
                      }}
                    />
                  )}
                </div>

                <input
                  className="w-full p-2 text-white rounded bg-neutral-700"
                  name="tipo"
                  value={editingProp.tipo || ""}
                  onChange={handlePropChange}
                  placeholder="Tipo (Departamento, Casa, etc.)"
                />
                <input
                  className="w-full p-2 text-white rounded bg-neutral-700"
                  name="gestion"
                  value={editingProp.gestion || ""}
                  onChange={handlePropChange}
                  placeholder="Gestión (Dueño Directo, Inmobiliaria)"
                />
                <input
                  className="w-full p-2 text-white rounded bg-neutral-700"
                  name="contacto"
                  value={editingProp.contacto || ""}
                  onChange={handlePropChange}
                  placeholder="Contacto"
                />
                <input
                  className="w-full p-2 text-white rounded bg-neutral-700"
                  name="habitaciones"
                  type="number"
                  value={editingProp.habitaciones || ""}
                  onChange={handlePropChange}
                  placeholder="Habitaciones"
                />
                <input
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

                <input
                  className="w-full p-2 text-white rounded bg-neutral-700"
                  name="fecha_ingreso"
                  type="date"
                  value={
                    editingProp.fecha_ingreso
                      ? new Date(editingProp.fecha_ingreso).toISOString().substr(0, 10)
                      : ""
                  }
                  onChange={handlePropChange}
                  placeholder="Fecha ingreso"
                />

                <input
                  className="w-full p-2 text-white rounded bg-neutral-700"
                  name="latitud"
                  type="number"
                  step="any"
                  value={editingProp.latitud || ""}
                  onChange={handlePropChange}
                  placeholder="Latitud"
                />
                <input
                  className="w-full p-2 text-white rounded bg-neutral-700"
                  name="longitud"
                  type="number"
                  step="any"
                  value={editingProp.longitud || ""}
                  onChange={handlePropChange}
                  placeholder="Longitud"
                />

                <div className="flex gap-2">
                  <button
                    onClick={saveProp}
                    className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                  >
                    Guardar
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
                    <strong>{prop.titulo || "Sin título"}</strong> - {prop.direccion || "Sin dirección"} - ${prop.precio || "0"}
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
