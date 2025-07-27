import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import ModalRegistrarMascota from "../components/ModalRegistrarMascota";
import AvatarSelector from "../components/AvatarSelector";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    apodo: "",
    telefono: "",
    avatar_url: "",
    provincia: "",
  });

  const fetchProfileAndMascotas = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Obtener datos de perfil
    const { data: profile, error: profileError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("correo", user.email)
      .single();

    if (profileError) {
      console.error("Error al obtener perfil:", profileError.message);
      setProfileData(null);
      setMascotas([]);
      setLoading(false);
      return;
    }

    setProfileData(profile);

    // Setear los datos en el formulario
    setFormData({
      nombre: profile.nombre || "",
      apellido: profile.apellido || "",
      apodo: profile.apodo || "",
      telefono: profile.telefono || "",
      avatar_url: profile.avatar_url || "",
      provincia: profile.provincia || "",
    });

    // Obtener las mascotas del usuario
    const { data: mascotasData, error: mascotasError } = await supabase
      .from("mascotas")
      .select("*")
      .eq("usuario_id", profile.id);

    if (mascotasError) {
      console.error("Error al obtener mascotas:", mascotasError.message);
      setMascotas([]);
    } else {
      setMascotas(mascotasData);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProfileAndMascotas();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("usuarios")
      .update(formData)
      .eq("id", profileData.id);

    if (error) {
      alert("Error al actualizar perfil: " + error.message);
    } else {
      setEditing(false);
      fetchProfileAndMascotas();
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      nombre: profileData.nombre || "",
      apellido: profileData.apellido || "",
      apodo: profileData.apodo || "",
      telefono: profileData.telefono || "",
      avatar_url: profileData.avatar_url || "",
      provincia: profileData.provincia || "",
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-50">
        <p>Cargando perfil y mascotas...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-50">
        <p>No estás autenticado. Por favor, inicia sesión.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-50">
      <h2 className="mb-6 text-3xl font-semibold">Perfil de usuario</h2>

      <div className="w-full max-w-md p-6 mb-10 bg-white rounded-lg shadow-md">
        {editing ? (
          <>
            <label className="block mb-2 font-semibold">
              Nombre
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded"
              />
            </label>

            <label className="block mb-2 font-semibold">
              Apellido
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded"
              />
            </label>

            <label className="block mb-2 font-semibold">
              Apodo
              <input
                type="text"
                name="apodo"
                value={formData.apodo}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded"
              />
            </label>

            <label className="block mb-2 font-semibold">
              Teléfono
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded"
              />
            </label>

            <label className="block mb-2 font-semibold">
              Provincia
              <input
                type="text"
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded"
              />
            </label>

            {/* Selector visual de avatars */}
            <AvatarSelector
              selectedAvatar={formData.avatar_url}
              onSelect={(url) => setFormData((prev) => ({ ...prev, avatar_url: url }))}
            />

            <div className="flex gap-4 mt-4">
              <button
                onClick={handleSave}
                className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
              >
                Guardar
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <>
            <p>
              <strong>Nombre:</strong> {profileData?.nombre || "No especificado"}
            </p>
            <p>
              <strong>Apellido:</strong> {profileData?.apellido || "No especificado"}
            </p>
            <p>
              <strong>Apodo:</strong> {profileData?.apodo || "No especificado"}
            </p>
            <p>
              <strong>Email:</strong> {profileData?.correo}
            </p>
            <p>
              <strong>Teléfono:</strong> {profileData?.telefono || "No especificado"}
            </p>
            <p>
              <strong>Provincia:</strong> {profileData?.provincia || "No especificado"}
            </p>
            <p>
              <strong>Suscripción:</strong> {profileData?.suscripcion || "Gratuito"}
            </p>
            {profileData?.avatar_url && (
              <img
                src={profileData.avatar_url}
                alt="Avatar"
                className="w-24 h-24 mt-4 rounded-full"
              />
            )}

            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Editar perfil
            </button>
          </>
        )}
      </div>

      {/* Mascotas */}
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <h3 className="text-2xl font-semibold">Mis Mascotas</h3>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          + Agregar mascota
        </button>
      </div>

      {mascotas.length === 0 ? (
        <p className="w-full max-w-md mb-6 text-gray-600">No tenés mascotas registradas.</p>
      ) : (
        <div className="grid w-full max-w-md grid-cols-1 gap-6 sm:grid-cols-2">
          {mascotas.map((m) => (
            <div
              key={m.id}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow"
            >
              <img
                src={m.foto_url || "https://placehold.co/150x150?text=Mascota"}
                alt={m.nombre}
                className="object-cover w-32 h-32 mb-3 rounded-full"
              />
              <h4 className="text-lg font-semibold">{m.nombre}</h4>
              <p className="text-sm text-gray-700">
                {m.especie} - {m.raza || "Sin raza"}
              </p>
              <p className="text-sm text-gray-700">
                {m.edad ? `${m.edad} años` : "Edad no especificada"}
              </p>
              <p className="mt-2 text-sm text-center text-gray-600">
                {m.descripcion || "Sin descripción"}
              </p>
              <p className="mt-1 text-sm text-gray-500">Estado: {m.estado || "Desconocido"}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleLogout}
        className="px-6 py-3 mt-10 text-white transition bg-red-600 rounded hover:bg-red-700"
      >
        Cerrar sesión
      </button>

      {showModal && (
        <ModalRegistrarMascota
          usuarioId={profileData.id}
          onClose={() => setShowModal(false)}
          onMascotaAgregada={fetchProfileAndMascotas}
        />
      )}
    </div>
  );
}
