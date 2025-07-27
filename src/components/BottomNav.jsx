import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../components/CartContext";

// Importa todos los íconos correctamente
import menuIcon from "../assets/home/menu-de-hamburguesa-icon.png";
import homeIcon from "../assets/home/home-icon.png";
import tiendaIcon from "../assets/home/tienda-icon.png";
import qrIcon from "../assets/home/qr-icon.png";
import perfilIcon from "../assets/home/perfil-icon.png";
import perdidaIcon from "../assets/home/perdida-icon.png";
import adopcionIcon from "../assets/home/adopcion-icon.png";
import adminIcon from "../assets/home/admin-icon.png";
import agregarIcon from "../assets/home/agregar-icon.png";
import reportlostIcon from "../assets/home/reportar-perdida-icon.png";
import administrarQRIcon from "../assets/home/administrar-qr-icon.png";
import petSocietyIcon from "../assets/home/pet-society-icon.png";
import adminBlogIcon from "../assets/home/admin-blog-icon.png";

import CartModal from "./CartModal";

export default function BottomNav() {
  const { isLoggedIn, user } = useAuth();
  const { totalQuantity } = useCart();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuView, setMenuView] = useState("sections"); // 'sections' | 'cart'

  const menuRef = useRef(null);

  // Definimos las secciones del menú
  const sections = [
    { name: "Inicio", path: "/", icon: homeIcon },
    { name: "Tienda", path: "/productos", icon: tiendaIcon },
    { name: "Escanear QR", path: "/scan", icon: qrIcon },
    { name: "Perfil", path: "/profile", icon: perfilIcon },
    { name: "Reportar Pérdida", path: "/mascotas-perdidas?reportar=true", icon: reportlostIcon },
    { name: "Mascotas Perdidas", path: "/mascotas-perdidas", icon: perdidaIcon },
    { name: "Adopciones", path: "/adopciones", icon: adopcionIcon },
    { name: "Pet Society", path: "/pet-society", icon: petSocietyIcon },
  ];

  // Añadimos opciones administrativas si el usuario es admin
  if (isLoggedIn && user?.email === "walterguillermopared@gmail.com") {
    sections.push({ name: "Administrar QR", path: "/administrar-qr", icon: administrarQRIcon });
    sections.push({ name: "Panel Admin", path: "/admin", icon: adminIcon });
    sections.push({ name: "Admin Blog", path: "/adminblog", icon: adminBlogIcon });
    sections.push({ name: "Cargar Producto", path: "/cargar-producto", icon: agregarIcon });
  }

  // Maneja cierre del menú con tecla ESC y enfoque automático
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

  // Abre menú en modo secciones
  const openMenuSections = () => {
    setMenuView("sections");
    setIsMenuOpen(true);
  };

  // Abre menú en modo carrito
  const openMenuCart = () => {
    setMenuView("cart");
    setIsMenuOpen(true);
  };

  // Cierra menú y resetea vista a secciones
  const closeMenu = () => {
    setIsMenuOpen(false);
    setMenuView("sections");
  };

  return (
    <>
      {/* Navegación inferior fija */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-between px-6 py-2 bg-white shadow-inner md:justify-around"
        role="navigation"
        aria-label="Navegación inferior"
      >
        {/* Botón menú */}
        <button
          onClick={openMenuSections}
          aria-expanded={isMenuOpen && menuView === "sections"}
          aria-controls="bottom-menu"
          className="flex flex-col items-center justify-center text-gray-700 transition hover:scale-110"
          aria-label="Abrir menú"
          type="button"
        >
          <img src={menuIcon} alt="Menú" className="w-6 h-6" />
          <span className="text-xs">Menú</span>
        </button>

        {/* Botón carrito */}
        <button
          onClick={openMenuCart}
          className="relative flex flex-col items-center justify-center text-gray-700 transition hover:scale-110"
          aria-label="Ver carrito"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 6h13m-7-6v6"
            />
          </svg>

          {totalQuantity > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {totalQuantity}
            </span>
          )}

          <span className="text-xs">Carrito</span>
        </button>

        {/* Botón perfil */}
        {isLoggedIn && (
          <button
            onClick={() => {
              navigate("/profile");
              closeMenu();
            }}
            className="flex flex-col items-center justify-center text-gray-700 transition hover:scale-110"
            aria-label="Ir a perfil"
            type="button"
          >
            <img src={perfilIcon} alt="Perfil" className="w-6 h-6" />
            <span className="text-xs">Perfil</span>
          </button>
        )}
      </nav>

      {/* Fondo oscuro para el menú cuando está abierto */}
      {isMenuOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 z-40 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}

      {/* Contenedor del menú inferior */}
      <div
        id="bottom-menu"
        ref={menuRef}
        tabIndex={-1}
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-lg transform transition-transform duration-300 ${
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
            className="mb-4 text-lg font-semibold text-center text-gray-700"
          >
            {menuView === "sections" ? "📱 Menú rápido" : "🛒 Tu carrito"}
          </h3>

          {/* Vista de secciones o carrito */}
          {menuView === "sections" ? (
            <div className="grid grid-cols-3 gap-4">
              {sections.map(({ name, path, icon }) => (
                <button
                  key={name}
                  onClick={() => {
                    navigate(path);
                    closeMenu();
                  }}
                  className="flex flex-col items-center justify-center p-3 transition bg-gray-100 rounded-xl hover:bg-blue-100"
                  aria-label={`Ir a ${name}`}
                  type="button"
                >
                  <img src={icon} alt={name} className="w-8 h-8 mb-1" />
                  <span className="text-xs text-center">{name}</span>
                </button>
              ))}
            </div>
          ) : (
            <CartModal onClose={closeMenu} />
          )}

          {/* Botón cerrar menú */}
          <button
            onClick={closeMenu}
            className="w-full py-2 mt-6 text-white transition bg-red-500 rounded hover:bg-red-600"
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
