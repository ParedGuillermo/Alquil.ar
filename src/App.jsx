import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Scan from "./pages/Scan";
import Adopciones from "./pages/Adopciones";
import AdminPanel from "./pages/AdminPanel";
import AdminBlog from "./pages/Adminblog";
import Productos from "./pages/Productos";
import CargarProducto from "./pages/CargarProductos";
import ReportLostPets from "./components/ReportLostPets";
import LostPets from "./pages/LostPets";
import AdministrarQR from "./components/AdministrarQR";
import PetSociety from "./components/PetSociety";
import Salud from "./components/PetSocietyPages/Salud";
import Entrenamiento from "./components/PetSocietyPages/Entrenamiento";
import Historias from "./components/PetSocietyPages/Historias";
import Eventos from "./components/PetSocietyPages/Eventos";
import Recursos from "./components/PetSocietyPages/Recursos";
import Nosotros from "./pages/Nosotros"; // Importación corregida
import SuccessStories from "./components/SuccessStories";

// NUEVAS IMPORTACIONES
import Donaciones from "./pages/Donaciones";
import RegistrarOrganizacion from "./pages/RegistrarOrganizacion"; // Verifica que este archivo exista

// CORREGIDO: Importación del componente DonacionDetalles
import DonacionDetalles from "./components/DonacionDetalles"; // Importa correctamente el componente

import BottomNav from "./components/BottomNav";
import { CartProvider } from "./components/CartContext";
import CartModal from "./components/CartModal";

// Componente protegido para usuarios autenticados
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
              {/* Páginas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/adopciones" element={<Adopciones />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/pet-society" element={<PetSociety />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reportar-perdida" element={<ReportLostPets />} />
              <Route path="/mascotas-perdidas" element={<LostPets />} />
              <Route path="/pet-society/salud" element={<Salud />} />
              <Route path="/pet-society/entrenamiento" element={<Entrenamiento />} />
              <Route path="/pet-society/historias" element={<Historias />} />
              <Route path="/pet-society/eventos" element={<Eventos />} />
              <Route path="/pet-society/recursos" element={<Recursos />} />
              <Route path="/nosotros" element={<Nosotros />} /> {/* Ruta corregida */}

              {/* NUEVAS RUTAS */}
              <Route path="/donaciones" element={<Donaciones />} /> {/* Donaciones */}
              <Route path="/registrar-organizacion" element={<RegistrarOrganizacion />} /> {/* Registrar organización */}
              <Route path="/donacion-detalles/:id" element={<DonacionDetalles />} /> {/* Detalles de la organización */}

              {/* Páginas protegidas */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/scan"
                element={
                  <ProtectedRoute>
                    <Scan />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cargar-producto"
                element={
                  <ProtectedRoute>
                    <CargarProducto />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/administrar-qr"
                element={
                  <ProtectedRoute>
                    <AdministrarQR />
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
              <Route
                path="/adminblog"
                element={
                  <ProtectedRoute>
                    <AdminBlog />
                  </ProtectedRoute>
                }
              />

              {/* Nueva ruta para casos de éxito (testimonios) */}
              <Route path="/casos-exito" element={<SuccessStories />} />
            </Routes>
          </div>

          {/* Modal carrito */}
          <CartModal />

          {/* Menú inferior */}
          <BottomNav />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
