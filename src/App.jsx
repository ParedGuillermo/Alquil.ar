// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Propiedades from "./pages/Propiedades";
import PropiedadDetalle from "./pages/PropiedadDetalle";  // Ruta singular
import Mensajes from "./pages/Mensajes";
import Profile from "./pages/Profile";  // Importamos Profile
import LoginRegister from "./components/LoginRegister";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {!user ? (
          <Route path="*" element={<LoginRegister />} />
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/propiedades" element={<Propiedades />} />
            <Route path="/propiedad/:id" element={<PropiedadDetalle />} />
            <Route path="/mensajes" element={<Mensajes />} />
            <Route path="/profile" element={<Profile />} />  {/* Nueva ruta para Profile */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
