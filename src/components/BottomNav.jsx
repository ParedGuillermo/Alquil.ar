import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import {
  MdMenu,
  MdHome,
  MdApartment,
  MdPerson,
  MdAdminPanelSettings,
  MdAddCircle,
} from "react-icons/md";

export default function BottomNav() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const sections = [
    { name: "Inicio", path: "/", icon: <MdHome size={28} /> },
    { name: "Propiedades", path: "/propiedades", icon: <MdApartment size={28} /> },
    { name: "Agregar Propiedad", path: "/cargar-propiedad", icon: <MdAddCircle size={28} /> },
    { name: "Perfil", path: "/profile", icon: <MdPerson size={28} /> },
  ];

  // Si es admin, agregamos el panel de admin
  if (isLoggedIn && user?.email === "walterguillermopared@gmail.com") {
    sections.push({ name: "Panel Admin", path: "/admin", icon: <MdAdminPanelSettings size={28} /> });
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setIsMenuOpen(false);
    }
    if (isMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      menuRef.current?.focus();
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-around px-6 py-2 bg-gray-900 shadow-inner"
        role="navigation"
        aria-label="Navegación inferior"
      >
        <button
          onClick={openMenu}
          aria-expanded={isMenuOpen}
          aria-controls="bottom-menu"
          className="flex flex-col items-center justify-center p-1 text-gray-300 transition rounded-lg hover:text-cyan-400 hover:bg-gray-800"
          aria-label="Abrir menú"
          type="button"
        >
          <MdMenu size={24} />
          <span className="text-xs select-none">Menú</span>
        </button>

        {isLoggedIn && (
          <button
            onClick={() => {
              navigate("/profile");
              closeMenu();
            }}
            className="flex flex-col items-center justify-center p-1 text-gray-300 transition rounded-lg hover:text-cyan-400 hover:bg-gray-800"
            aria-label="Ir a perfil"
            type="button"
          >
            <MdPerson size={24} />
            <span className="text-xs select-none">Perfil</span>
          </button>
        )}
      </nav>

      {isMenuOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-black bg-opacity-70 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}

      <div
        id="bottom-menu"
        ref={menuRef}
        tabIndex={-1}
        className={`fixed bottom-0 left-0 right-0 z-50 bg-gray-900 rounded-t-3xl shadow-lg transform transition-transform duration-300 ${
          isMenuOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "60vh", overflowY: "auto" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-title"
      >
        <div className="p-5">
          <h3
            id="menu-title"
            className="mb-4 text-lg font-semibold text-center text-gray-300 select-none"
          >
            📱 Menú rápido
          </h3>

          <div className="grid grid-cols-3 gap-4">
            {sections.map(({ name, path, icon }) => (
              <button
                key={name}
                onClick={() => {
                  navigate(path);
                  closeMenu();
                }}
                className="flex flex-col items-center justify-center p-3 transition bg-gray-800 rounded-xl hover:bg-cyan-700 hover:text-white"
                aria-label={`Ir a ${name}`}
                type="button"
              >
                <span className="mb-1">{icon}</span>
                <span className="text-xs text-center select-none">{name}</span>
              </button>
            ))}
          </div>

          <button
            onClick={closeMenu}
            className="w-full py-2 mt-6 text-white transition rounded select-none bg-cyan-600 hover:bg-cyan-700"
            aria-label="Cerrar menú"
            type="button"
          >
            Cerrar menú
          </button>
        </div>
      </div>
    </>
  );
}
