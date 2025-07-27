import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheckIcon, BookOpenIcon, HeartIcon, CalendarIcon, MapIcon } from "@heroicons/react/24/outline";

const sections = [
  { name: "Salud y Bienestar", path: "/pet-society/salud", icon: ShieldCheckIcon },
  { name: "Entrenamiento", path: "/pet-society/entrenamiento", icon: BookOpenIcon },
  { name: "Historias Inspiradoras", path: "/pet-society/historias", icon: HeartIcon },
  { name: "Eventos y Noticias", path: "/pet-society/eventos", icon: CalendarIcon },
  { name: "Recursos Locales", path: "/pet-society/recursos", icon: MapIcon },
];

export default function PetSociety() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-br from-purple-50 to-pink-100">
      <h1 className="mb-10 text-4xl font-extrabold tracking-tight text-center text-purple-800">
        Pet Society 🐾
      </h1>

      <p className="max-w-xl mx-auto mb-12 text-lg text-center text-gray-700">
        Bienvenido a Pet Society, tu espacio para aprender, compartir y conectar con la comunidad pet friendly.
      </p>

      <div className="grid max-w-4xl gap-8 mx-auto sm:grid-cols-2 lg:grid-cols-3">
        {sections.map(({ name, path, icon: Icon }) => (
          <button
            key={name}
            onClick={() => navigate(path)}
            className="flex flex-col items-start p-6 space-y-4 bg-white rounded-2xl shadow-md transition hover:shadow-xl hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            <Icon className="w-10 h-10 text-purple-600" />
            <h2 className="text-xl font-semibold text-purple-800">{name}</h2>
            <p className="text-gray-600">Explorar sección</p>
          </button>
        ))}
      </div>
    </div>
  );
}
