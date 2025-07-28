import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import CargarPropiedad from "./pages/CargarPropiedad";
import Nosotros from "./pages/Nosotros";
import PropiedadDetalle from "./pages/PropiedadDetalle";
import Propiedades from "./pages/Propiedades";
import Servicios from "./pages/Servicios";

import BottomNav from "./components/BottomNav";
import { CartProvider } from "./components/CartContext";
import CartModal from "./components/CartModal";

// Ruta protegida para usuarios autenticados
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="pb-20">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/propiedades" element={<Propiedades />} />
              <Route path="/propiedad/:id" element={<PropiedadDetalle />} />
              <Route path="/servicios" element={<Servicios />} />

              {/* Rutas protegidas */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cargar-propiedad"
                element={
                  <ProtectedRoute>
                    <CargarPropiedad />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>

          {/* Modal carrito */}
          <CartModal />

          {/* Navegación inferior */}
          <BottomNav />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
