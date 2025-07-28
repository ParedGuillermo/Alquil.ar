import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

export default function Profile() {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [propiedades, setPropiedades] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);

  const [editingPropId, setEditingPropId] = useState(null);
  const [formProp, setFormProp] = useState({});

  // Carga perfil básico
  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setLoadingProfile(false);
        return;
      }
      setLoadingProfile(true);
      const { data, error } = await supabase
        .from("usuarios")
        .select("nombre, email")
        .eq("email", user.email)
        .single();
      if (!error) setProfileData(data);
      setLoadingProfile(false);
    }
    fetchProfile();
  }, [user]);

  // Carga propiedades del usuario según contacto=email
  useEffect(() => {
    async function fetchPropiedades() {
      if (!user) {
        setLoadingProps(false);
        return;
      }
      setLoadingProps(true);
      const { data, error } = await supabase
        .from("propiedades")
        .select("*")
        .eq("contacto", user.email);
      if (!error) setPropiedades(data);
      setLoadingProps(false);
    }
    fetchPropiedades();
  }, [user]);

  // Manejo del formulario para editar propiedad
  const startEditing = (prop) => {
    setEditingPropId(prop.id);
    setFormProp({
      titulo: prop.titulo,
      descripcion: prop.descripcion,
      precio: prop.precio,
      direccion: prop.direccion,
      imagen_url: prop.imagen_url,
      tipo: prop.tipo,
      gestion: prop.gestion,
      contacto: prop.contacto,
      habitaciones: prop.habitaciones,
      superficie: prop.superficie,
      permiten_mascotas: prop.permiten_mascotas,
      permiten_ninos: prop.permiten_ninos,
      servicios_incluidos: prop.servicios_incluidos,
      amoblado: prop.amoblado,
      fecha_ingreso: prop.fecha_ingreso ? prop.fecha_ingreso.substring(0,10) : "",
    });
  };

  const cancelEditing = () => {
    setEditingPropId(null);
    setFormProp({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormProp((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const savePropiedad = async () => {
    // Validar campos mínimos (ejemplo)
    if (!formProp.titulo || !formProp.descripcion || !formProp.precio || !formProp.direccion) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }
    const updates = {
      titulo: formProp.titulo,
      descripcion: formProp.descripcion,
      precio: parseInt(formProp.precio, 10),
      direccion: formProp.direccion,
      imagen_url: formProp.imagen_url,
      tipo: formProp.tipo,
      gestion: formProp.gestion,
      contacto: formProp.contacto,
      habitaciones: parseInt(formProp.habitaciones, 10) || 0,
      superficie: parseInt(formProp.superficie, 10) || 0,
      permiten_mascotas: formProp.permiten_mascotas,
      permiten_ninos: formProp.permiten_ninos,
      servicios_incluidos: formProp.servicios_incluidos,
      amoblado: formProp.amoblado,
      fecha_ingreso: formProp.fecha_ingreso || null,
    };

    const { error } = await supabase
      .from("propiedades")
      .update(updates)
      .eq("id", editingPropId);

    if (error) {
      alert("Error actualizando propiedad: " + error.message);
      return;
    }

    alert("Propiedad actualizada correctamente.");
    cancelEditing();
    // Refrescar lista
    const { data, error: err } = await supabase
      .from("propiedades")
      .select("*")
      .eq("contacto", user.email);
    if (!err) setPropiedades(data);
  };

  if (!user) return <p className="p-6 text-white">No estás autenticado.</p>;

  return (
    <div className="min-h-screen p-6 bg-background text-textPrimary">
      <h1 className="mb-6 text-4xl font-bold text-white">Perfil</h1>

      {loadingProfile ? (
        <p>Cargando perfil...</p>
      ) : (
        <div className="mb-12">
          <p><strong>Nombre:</strong> {profileData?.nombre || "-"}</p>
          <p><strong>Email:</strong> {profileData?.email || "-"}</p>
        </div>
      )}

      <h2 className="mb-4 text-3xl font-semibold text-white">Mis Propiedades</h2>

      {loadingProps ? (
        <p>Cargando propiedades...</p>
      ) : propiedades.length === 0 ? (
        <p>No tenés propiedades registradas.</p>
      ) : (
        propiedades.map((prop) =>
          editingPropId === prop.id ? (
            <div
              key={prop.id}
              className="p-6 mb-6 bg-gray-800 rounded-lg"
            >
              <h3 className="mb-4 text-xl font-bold text-white">Editar propiedad #{prop.id}</h3>

              <label className="block mb-2">
                Título *
                <input
                  name="titulo"
                  value={formProp.titulo}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 text-white bg-gray-700 rounded"
                />
              </label>

              <label className="block mb-2">
                Descripción *
                <textarea
                  name="descripcion"
                  value={formProp.descripcion}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 text-white bg-gray-700 rounded"
                  rows={4}
                />
              </label>

              <label className="block mb-2">
                Precio (ARS) *
                <input
                  type="number"
                  name="precio"
                  value={formProp.precio}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 text-white bg-gray-700 rounded"
                />
              </label>

              <label className="block mb-2">
                Dirección *
                <input
                  name="direccion"
                  value={formProp.direccion}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 text-white bg-gray-700 rounded"
                />
              </label>

              <label className="block mb-2">
                URL imagen
                <input
                  name="imagen_url"
                  value={formProp.imagen_url}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 text-white bg-gray-700 rounded"
                />
              </label>

              <label className="block mb-2">
                Tipo *
                <select
                  name="tipo"
                  value={formProp.tipo}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 text-white bg-gray-700 rounded"
                >
                  <option value="Departamento">Departamento</option>
                  <option value="Casa">Casa</option>
                  <option value="Estudio">Estudio</option>
                  <option value="Loft">Loft</option>
                  <option value="Monoambiente">Monoambiente</option>
                </select>
              </label>

              <label className="block mb-2">
                Gestión *
                <select
                  name="gestion"
                  value={formProp.gestion}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 text-white bg-gray-700 rounded"
                >
                  <option value="Dueño Directo">Dueño Directo</option>
                  <option value="Inmobiliaria">Inmobiliaria</option>
                </select>
              </label>

              <label className="block mb-2">
                Contacto *
                <input
                  name="contacto"
                  value={formProp.contacto}
                  readOnly
                  className="w-full p-2 mt-1 text-gray-400 bg-gray-600 rounded cursor-not-allowed"
                />
              </label>

              <label className="block mb-2">
                Habitaciones
                <input
                  type="number"
                  name="habitaciones"
                  value={formProp.habitaciones}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 text-white bg-gray-700 rounded"
                />
              </label>

              <label className="block mb-2">
                Superficie (m²)
                <input
                  type="number"
                  name="superficie"
                  value={formProp.superficie}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 text-white bg-gray-700 rounded"
                />
              </label>

              <label className="inline-flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  name="permiten_mascotas"
                  checked={formProp.permiten_mascotas}
                  onChange={handleChange}
                />
                Permiten mascotas
              </label>

              <label className="inline-flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  name="permiten_ninos"
                  checked={formProp.permiten_ninos}
                  onChange={handleChange}
                />
                Permiten niños
              </label>

              <label className="inline-flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  name="servicios_incluidos"
                  checked={formProp.servicios_incluidos}
                  onChange={handleChange}
                />
                Servicios incluidos
              </label>

              <label className="inline-flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  name="amoblado"
                  checked={formProp.amoblado}
                  onChange={handleChange}
                />
                Amoblado
              </label>

              <label className="block mb-4">
                Fecha ingreso
                <input
                  type="date"
                  name="fecha_ingreso"
                  value={formProp.fecha_ingreso}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 text-white bg-gray-700 rounded"
                />
              </label>

              <div className="flex gap-4">
                <button
                  onClick={savePropiedad}
                  className="px-4 py-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700"
                >
                  Guardar
                </button>
                <button
                  onClick={cancelEditing}
                  className="px-4 py-2 font-semibold text-white bg-red-600 rounded hover:bg-red-700"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div
              key={prop.id}
              className="p-6 mb-6 bg-gray-800 rounded-lg cursor-pointer"
              onClick={() => startEditing(prop)}
            >
              <h3 className="text-xl font-bold text-white">{prop.titulo}</h3>
              <p className="mb-1 text-gray-300 truncate">{prop.descripcion}</p>
              <p className="mb-1 text-gray-300">Precio: ${prop.precio}</p>
              <p className="mb-1 text-gray-300">Dirección: {prop.direccion}</p>
              <p className="mb-1 text-gray-300">Tipo: {prop.tipo}</p>
              <p className="mb-1 text-gray-300">Gestión: {prop.gestion}</p>
            </div>
          )
        )
      )}
      <button
        onClick={logout}
        className="px-6 py-3 mt-6 text-white bg-red-600 rounded hover:bg-red-700"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
