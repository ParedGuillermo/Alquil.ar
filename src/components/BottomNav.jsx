// src/components/BottomNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function BottomNav() {
  const baseButtonClasses = "flex flex-col items-center py-1 text-gray-700";
  const activeClasses = "text-blue-600 font-semibold";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around py-2 bg-white border-t shadow-md">
      <NavLink
        to="/"
        aria-label="Inicio"
        className={({ isActive }) =>
          `${baseButtonClasses} ${isActive ? activeClasses : ""}`
        }
      >
        <span className="material-icons">home</span>
        <span className="text-xs">Inicio</span>
      </NavLink>

      <NavLink
        to="/propiedades"
        aria-label="Propiedades"
        className={({ isActive }) =>
          `${baseButtonClasses} ${isActive ? activeClasses : ""}`
        }
      >
        <span className="material-icons">apartment</span>
        <span className="text-xs">Propiedades</span>
      </NavLink>

      <NavLink
        to="/mensajes"
        aria-label="Mensajes"
        className={({ isActive }) =>
          `${baseButtonClasses} ${isActive ? activeClasses : ""}`
        }
      >
        <span className="material-icons">chat</span>
        <span className="text-xs">Mensajes</span>
      </NavLink>

      <NavLink
        to="/profile"
        aria-label="Perfil"
        className={({ isActive }) =>
          `${baseButtonClasses} ${isActive ? activeClasses : ""}`
        }
      >
        <span className="material-icons">person</span>
        <span className="text-xs">Perfil</span>
      </NavLink>
    </nav>
  );
}
