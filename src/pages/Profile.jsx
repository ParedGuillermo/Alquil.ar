// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("No se encontró usuario");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("usuarios")
        .select("nombre, email, tipo")
        .eq("id", user.id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setUserData(data);
      }
      setLoading(false);
    }

    fetchUserData();
  }, []);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Error cerrando sesión: " + error.message);
    } else {
      navigate("/login");
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Cargando perfil...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen px-4">
        <p className="text-lg text-center text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-3xl font-semibold text-center text-gray-800">
          Perfil de Usuario
        </h1>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Nombre</label>
          <p className="text-lg text-gray-900">{userData?.nombre || "No disponible"}</p>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <p className="text-lg text-gray-900">{userData?.email || "No disponible"}</p>
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">Tipo de usuario</label>
          <p className="text-lg text-gray-900 capitalize">{userData?.tipo || "No disponible"}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3 font-semibold text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
          aria-label="Cerrar sesión"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
