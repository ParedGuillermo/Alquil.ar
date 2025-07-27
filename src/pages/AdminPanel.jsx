import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [organizaciones, setOrganizaciones] = useState([]);
  const [organizacionesVerificadas, setOrganizacionesVerificadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const [editingUser, setEditingUser] = useState(null);
  const [editingPet, setEditingPet] = useState(null);
  const [editingOrg, setEditingOrg] = useState(null);

  // Formularios para crear nuevos registros
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    rol: "usuario",
  });

  const [nuevaMascota, setNuevaMascota] = useState({
    nombre: "",
    raza: "",
    especie: "",
    edad: "",
    estado: "propia",
  });

  const [nuevaOrganizacion, setNuevaOrganizacion] = useState({
    nombre: "",
    descripcion: "",
    ubicacion: "",
    contacto: "",
    codigo_donacion: "",
    verificada: false,
  });

  const isAdmin = user?.email === "walterguillermopared@gmail.com";

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: usuariosData, error: usuariosError } = await supabase.from("usuarios").select("*");
      const { data: mascotasData, error: mascotasError } = await supabase.from("mascotas").select("*");
      const { data: organizacionesData, error: orgsError } = await supabase
        .from("organizaciones")
        .select("*")
        .eq("verificada", false)
        .order("fecha_registro", { ascending: false });
      const { data: orgsVerificadas, error: orgsVerificadasError } = await supabase
        .from("organizaciones")
        .select("*")
        .eq("verificada", true)
        .order("fecha_registro", { ascending: false });

      if (usuariosError || mascotasError || orgsError || orgsVerificadasError) {
        throw new Error("Error al cargar los datos.");
      }

      setUsuarios(usuariosData || []);
      setMascotas(mascotasData || []);
      setOrganizaciones(organizacionesData || []);
      setOrganizacionesVerificadas(orgsVerificadas || []);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      setMensaje("Error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  // ----------- CRUD USUARIOS --------------------

  const handleCreateUser = async () => {
    if (!nuevoUsuario.nombre || !nuevoUsuario.apellido || !nuevoUsuario.correo) {
      alert("Completa todos los campos del usuario.");
      return;
    }
    try {
      const { error } = await supabase.from("usuarios").insert(nuevoUsuario);
      if (error) throw error;
      setNuevoUsuario({ nombre: "", apellido: "", correo: "", rol: "usuario" });
      fetchData();
      setMensaje("Usuario creado correctamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al crear usuario:", error);
      alert("Error al crear usuario.");
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser?.nombre || !editingUser?.apellido || !editingUser?.correo) {
      alert("Completa todos los campos del usuario.");
      return;
    }
    const { id, ...data } = editingUser;
    try {
      const { error } = await supabase.from("usuarios").update(data).eq("id", id);
      if (error) throw error;
      setEditingUser(null);
      fetchData();
      setMensaje("Usuario actualizado correctamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      alert("Error al actualizar usuario.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      const { error } = await supabase.from("usuarios").delete().eq("id", id);
      if (error) throw error;
      fetchData();
      setMensaje("Usuario eliminado");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Error al eliminar usuario.");
    }
  };

  // ----------- CRUD MASCOTAS --------------------

  const handleCreateMascota = async () => {
    if (!nuevaMascota.nombre || !nuevaMascota.raza || !nuevaMascota.especie) {
      alert("Completa todos los campos de la mascota.");
      return;
    }
    try {
      const toInsert = {
        ...nuevaMascota,
        edad: parseInt(nuevaMascota.edad) || null,
      };
      const { error } = await supabase.from("mascotas").insert(toInsert);
      if (error) throw error;
      setNuevaMascota({ nombre: "", raza: "", especie: "", edad: "", estado: "propia" });
      fetchData();
      setMensaje("Mascota creada correctamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al crear mascota:", error);
      alert("Error al crear mascota.");
    }
  };

  const handleUpdateMascota = async () => {
    if (!editingPet?.nombre || !editingPet?.raza || !editingPet?.especie) {
      alert("Completa todos los campos de la mascota.");
      return;
    }
    const { id, ...data } = editingPet;
    try {
      const dataUpdate = { ...data };
      if (dataUpdate.edad) dataUpdate.edad = parseInt(dataUpdate.edad);
      const { error } = await supabase.from("mascotas").update(dataUpdate).eq("id", id);
      if (error) throw error;
      setEditingPet(null);
      fetchData();
      setMensaje("Mascota actualizada correctamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al actualizar mascota:", error);
      alert("Error al actualizar mascota.");
    }
  };

  const handleDeleteMascota = async (id) => {
    if (!window.confirm("¿Eliminar esta mascota?")) return;
    try {
      const { error } = await supabase.from("mascotas").delete().eq("id", id);
      if (error) throw error;
      fetchData();
      setMensaje("Mascota eliminada");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al eliminar mascota:", error);
      alert("Error al eliminar mascota.");
    }
  };

  // ----------- CRUD ORGANIZACIONES --------------------

  const handleCreateOrganizacion = async () => {
    if (!nuevaOrganizacion.nombre || !nuevaOrganizacion.descripcion || !nuevaOrganizacion.ubicacion) {
      alert("Completa todos los campos de la organización.");
      return;
    }
    try {
      const { error } = await supabase.from("organizaciones").insert(nuevaOrganizacion);
      if (error) throw error;
      setNuevaOrganizacion({
        nombre: "",
        descripcion: "",
        ubicacion: "",
        contacto: "",
        codigo_donacion: "",
        verificada: false,
      });
      fetchData();
      setMensaje("Organización creada correctamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al crear organización:", error);
      alert("Error al crear organización.");
    }
  };

  const handleUpdateOrganizacion = async () => {
    if (!editingOrg?.nombre || !editingOrg?.descripcion || !editingOrg?.ubicacion) {
      alert("Completa todos los campos de la organización.");
      return;
    }
    const { id, ...data } = editingOrg;
    try {
      const { error } = await supabase.from("organizaciones").update(data).eq("id", id);
      if (error) throw error;
      setEditingOrg(null);
      fetchData();
      setMensaje("Organización actualizada correctamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al actualizar organización:", error);
      alert("Error al actualizar organización.");
    }
  };

  const handleDeleteOrganizacion = async (id) => {
    if (!window.confirm("¿Eliminar esta organización?")) return;
    try {
      const { error } = await supabase.from("organizaciones").delete().eq("id", id);
      if (error) throw error;
      fetchData();
      setMensaje("Organización eliminada");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al eliminar organización:", error);
      alert("Error al eliminar organización.");
    }
  };

  // Aprobar organización pendiente
  const aprobarOrganizacion = async (id) => {
    try {
      const { error } = await supabase
        .from("organizaciones")
        .update({ verificada: true })
        .eq("id", id);

      if (error) {
        setMensaje("Error al aprobar la organización.");
      } else {
        setMensaje("Organización aprobada.");
      }

      fetchData();
      setTimeout(() => setMensaje(""), 2000);
    } catch (error) {
      console.error("Error al aprobar la organización:", error);
      setMensaje("Error al aprobar la organización.");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <p>No estás autorizado para acceder a esta página.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 mx-auto bg-gray-50 max-w-7xl">
      <h1 className="mb-6 text-4xl font-bold">Panel de Administración</h1>

      {mensaje && (
        <div className="p-3 mb-4 text-white bg-green-600 rounded">{mensaje}</div>
      )}

      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <>
          {/* Sección Usuarios */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold">Usuarios</h2>

            {/* Crear usuario */}
            <div className="p-4 mb-6 bg-white rounded shadow">
              <h3 className="mb-2 text-xl font-bold">Crear Usuario</h3>
              <input
                type="text"
                placeholder="Nombre"
                value={nuevoUsuario.nombre}
                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                placeholder="Apellido"
                value={nuevoUsuario.apellido}
                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, apellido: e.target.value })}
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="email"
                placeholder="Correo"
                value={nuevoUsuario.correo}
                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })}
                className="w-full p-2 mb-2 border rounded"
              />
              <select
                value={nuevoUsuario.rol}
                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}
                className="w-full p-2 mb-2 border rounded"
              >
                <option value="usuario">Usuario</option>
                <option value="admin">Admin</option>
              </select>
              <button
                onClick={handleCreateUser}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Crear Usuario
              </button>
            </div>

            {/* Editar usuario */}
            {editingUser && (
              <div className="p-4 mb-6 bg-white rounded shadow">
                <h3 className="mb-2 text-xl font-bold">Editar Usuario</h3>
                <input
                  type="text"
                  value={editingUser.nombre}
                  onChange={(e) => setEditingUser({ ...editingUser, nombre: e.target.value })}
                  placeholder="Nombre"
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="text"
                  value={editingUser.apellido}
                  onChange={(e) => setEditingUser({ ...editingUser, apellido: e.target.value })}
                  placeholder="Apellido"
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="email"
                  value={editingUser.correo}
                  onChange={(e) => setEditingUser({ ...editingUser, correo: e.target.value })}
                  placeholder="Correo"
                  className="w-full p-2 mb-2 border rounded"
                />
                <select
                  value={editingUser.rol}
                  onChange={(e) => setEditingUser({ ...editingUser, rol: e.target.value })}
                  className="w-full p-2 mb-2 border rounded"
                >
                  <option value="usuario">Usuario</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  onClick={handleUpdateUser}
                  className="px-4 py-2 mr-2 text-white bg-green-600 rounded hover:bg-green-700"
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            )}

            {/* Listado de usuarios */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {usuarios.map((u) => (
                <div key={u.id} className="p-4 bg-white border shadow rounded-xl">
                  <h3 className="text-lg font-semibold">{u.nombre} {u.apellido}</h3>
                  <p className="text-sm text-gray-600">Correo: {u.correo}</p>
                  <p className="text-sm text-gray-500">Rol: {u.rol}</p>
                  <div className="mt-4 space-x-2">
                    <button
                      onClick={() => setEditingUser(u)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sección Mascotas */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold">Mascotas</h2>

            {/* Crear mascota */}
            <div className="p-4 mb-6 bg-white rounded shadow">
              <h3 className="mb-2 text-xl font-bold">Crear Mascota</h3>
              <input
                type="text"
                placeholder="Nombre"
                value={nuevaMascota.nombre}
                onChange={(e) => setNuevaMascota({ ...nuevaMascota, nombre: e.target.value })}
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                placeholder="Raza"
                value={nuevaMascota.raza}
                onChange={(e) => setNuevaMascota({ ...nuevaMascota, raza: e.target.value })}
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                placeholder="Especie"
                value={nuevaMascota.especie}
                onChange={(e) => setNuevaMascota({ ...nuevaMascota, especie: e.target.value })}
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="number"
                placeholder="Edad"
                value={nuevaMascota.edad}
                onChange={(e) => setNuevaMascota({ ...nuevaMascota, edad: e.target.value })}
                className="w-full p-2 mb-2 border rounded"
                min="0"
              />
              <select
                value={nuevaMascota.estado}
                onChange={(e) => setNuevaMascota({ ...nuevaMascota, estado: e.target.value })}
                className="w-full p-2 mb-2 border rounded"
              >
                <option value="propia">Propia</option>
                <option value="en_adopcion">En adopción</option>
                <option value="perdida">Perdida</option>
              </select>
              <button
                onClick={handleCreateMascota}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Crear Mascota
              </button>
            </div>

            {/* Editar mascota */}
            {editingPet && (
              <div className="p-4 mb-6 bg-white rounded shadow">
                <h3 className="mb-2 text-xl font-bold">Editar Mascota</h3>
                <input
                  type="text"
                  value={editingPet.nombre}
                  onChange={(e) => setEditingPet({ ...editingPet, nombre: e.target.value })}
                  placeholder="Nombre"
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="text"
                  value={editingPet.raza}
                  onChange={(e) => setEditingPet({ ...editingPet, raza: e.target.value })}
                  placeholder="Raza"
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="text"
                  value={editingPet.especie}
                  onChange={(e) => setEditingPet({ ...editingPet, especie: e.target.value })}
                  placeholder="Especie"
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="number"
                  value={editingPet.edad}
                  onChange={(e) => setEditingPet({ ...editingPet, edad: e.target.value })}
                  placeholder="Edad"
                  className="w-full p-2 mb-2 border rounded"
                  min="0"
                />
                <select
                  value={editingPet.estado}
                  onChange={(e) => setEditingPet({ ...editingPet, estado: e.target.value })}
                  className="w-full p-2 mb-2 border rounded"
                >
                  <option value="propia">Propia</option>
                  <option value="en_adopcion">En adopción</option>
                  <option value="perdida">Perdida</option>
                </select>
                <button
                  onClick={handleUpdateMascota}
                  className="px-4 py-2 mr-2 text-white bg-green-600 rounded hover:bg-green-700"
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={() => setEditingPet(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            )}

            {/* Listado mascotas */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mascotas.map((m) => (
                <div key={m.id} className="p-4 bg-white border shadow rounded-xl">
                  <h3 className="text-lg font-semibold">{m.nombre}</h3>
                  <p className="text-sm text-gray-600">Raza: {m.raza}</p>
                  <p className="text-sm text-gray-600">Especie: {m.especie}</p>
                  <p className="text-sm text-gray-500">Edad: {m.edad}</p>
                  <p className="text-sm text-gray-500">Estado: {m.estado}</p>
                  <div className="mt-4 space-x-2">
                    <button
                      onClick={() => setEditingPet(m)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteMascota(m.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sección Organizaciones */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold">Organizaciones</h2>

            {/* Crear organización */}
            <div className="p-4 mb-6 bg-white rounded shadow">
              <h3 className="mb-2 text-xl font-bold">Crear Organización</h3>
              <input
                type="text"
                placeholder="Nombre"
                value={nuevaOrganizacion.nombre}
                onChange={(e) => setNuevaOrganizacion({ ...nuevaOrganizacion, nombre: e.target.value })}
                className="w-full p-2 mb-2 border rounded"
              />
              <textarea
                placeholder="Descripción"
                value={nuevaOrganizacion.descripcion}
                onChange={(e) => setNuevaOrganizacion({ ...nuevaOrganizacion, descripcion: e.target.value })}
                className="w-full p-2 mb-2 border rounded"
                rows={3}
              />
              <input
                type="text"
                placeholder="Ubicación"
                value={nuevaOrganizacion.ubicacion}
                onChange={(e) => setNuevaOrganizacion({ ...nuevaOrganizacion, ubicacion: e.target.value })}
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                placeholder="Contacto"
                value={nuevaOrganizacion.contacto}
                onChange={(e) => setNuevaOrganizacion({ ...nuevaOrganizacion, contacto: e.target.value })}
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                placeholder="Código de donación (opcional)"
                value={nuevaOrganizacion.codigo_donacion}
                onChange={(e) => setNuevaOrganizacion({ ...nuevaOrganizacion, codigo_donacion: e.target.value })}
                className="w-full p-2 mb-2 border rounded"
              />
              <label className="inline-flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={nuevaOrganizacion.verificada}
                  onChange={(e) => setNuevaOrganizacion({ ...nuevaOrganizacion, verificada: e.target.checked })}
                  className="mr-2"
                />
                Verificada
              </label>
              <br />
              <button
                onClick={handleCreateOrganizacion}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Crear Organización
              </button>
            </div>

            {/* Editar organización */}
            {editingOrg && (
              <div className="p-4 mb-6 bg-white rounded shadow">
                <h3 className="mb-2 text-xl font-bold">Editar Organización</h3>
                <input
                  type="text"
                  value={editingOrg.nombre}
                  onChange={(e) => setEditingOrg({ ...editingOrg, nombre: e.target.value })}
                  placeholder="Nombre"
                  className="w-full p-2 mb-2 border rounded"
                />
                <textarea
                  value={editingOrg.descripcion}
                  onChange={(e) => setEditingOrg({ ...editingOrg, descripcion: e.target.value })}
                  placeholder="Descripción"
                  className="w-full p-2 mb-2 border rounded"
                  rows={3}
                />
                <input
                  type="text"
                  value={editingOrg.ubicacion}
                  onChange={(e) => setEditingOrg({ ...editingOrg, ubicacion: e.target.value })}
                  placeholder="Ubicación"
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="text"
                  value={editingOrg.contacto}
                  onChange={(e) => setEditingOrg({ ...editingOrg, contacto: e.target.value })}
                  placeholder="Contacto"
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="text"
                  value={editingOrg.codigo_donacion}
                  onChange={(e) => setEditingOrg({ ...editingOrg, codigo_donacion: e.target.value })}
                  placeholder="Código de donación (opcional)"
                  className="w-full p-2 mb-2 border rounded"
                />
                <label className="inline-flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={editingOrg.verificada}
                    onChange={(e) => setEditingOrg({ ...editingOrg, verificada: e.target.checked })}
                    className="mr-2"
                  />
                  Verificada
                </label>
                <br />
                <button
                  onClick={handleUpdateOrganizacion}
                  className="px-4 py-2 mr-2 text-white bg-green-600 rounded hover:bg-green-700"
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={() => setEditingOrg(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            )}

            {/* Listado Organizaciones Verificadas */}
            <h3 className="mb-2 text-xl font-bold">Organizaciones Aprobadas</h3>
            {organizacionesVerificadas.length === 0 ? (
              <p className="mb-4 text-gray-500">No hay organizaciones aprobadas.</p>
            ) : (
              <div className="mb-8 space-y-4">
                {organizacionesVerificadas.map((org) => (
                  <div key={org.id} className="p-4 bg-white border shadow rounded-xl">
                    <h4 className="text-lg font-semibold">{org.nombre}</h4>
                    <p className="text-sm text-gray-600">{org.descripcion}</p>
                    <p className="text-sm text-gray-500">📍 {org.ubicacion}</p>
                    <p className="text-sm text-gray-500">📞 {org.contacto}</p>
                    {org.codigo_donacion && (
                      <p className="mt-1 text-sm text-green-600 break-all">💸 {org.codigo_donacion}</p>
                    )}
                    <div className="mt-4 space-x-2">
                      <button
                        onClick={() => setEditingOrg(org)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteOrganizacion(org.id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Organizaciones Pendientes */}
            <h3 className="mb-2 text-xl font-bold">Organizaciones Pendientes</h3>
            {organizaciones.length === 0 ? (
              <p className="text-gray-500">No hay organizaciones para verificar.</p>
            ) : (
              <div className="space-y-4">
                {organizaciones.map((org) => (
                  <div key={org.id} className="p-4 bg-white border shadow rounded-xl">
                    <h4 className="text-lg font-semibold">{org.nombre}</h4>
                    <p className="text-sm text-gray-600">{org.descripcion}</p>
                    <p className="text-sm text-gray-500">📍 {org.ubicacion}</p>
                    <p className="text-sm text-gray-500">📞 {org.contacto}</p>
                    {org.codigo_donacion && (
                      <p className="mt-1 text-sm text-green-600 break-all">💸 {org.codigo_donacion}</p>
                    )}
                    <div className="mt-4 space-x-2">
                      <button
                        onClick={() => aprobarOrganizacion(org.id)}
                        className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                      >
                        Aprobar organización
                      </button>
                      <button
                        onClick={() => handleDeleteOrganizacion(org.id)}
                        className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                      >
                        Eliminar organización
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-6 py-3 mt-8 text-white transition bg-red-600 rounded hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </>
      )}
    </div>
  );
}
