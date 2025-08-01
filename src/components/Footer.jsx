// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="px-6 py-10 mt-20 text-white bg-gray-900">
      <div className="grid max-w-6xl grid-cols-1 gap-8 mx-auto sm:grid-cols-3">
        <div>
          <h3 className="mb-3 text-lg font-semibold">Alquil.ar</h3>
          <p className="text-sm text-gray-400">
            Facilitamos la búsqueda de propiedades en Corrientes con un diseño claro y simple.
          </p>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold">Enlaces</h4>
          <ul className="space-y-1 text-sm text-gray-400">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/nosotros">Nosotros</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
            <li><Link to="/terminos-y-condiciones">Términos y condiciones</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold">Contacto</h4>
          <ul className="space-y-1 text-sm text-gray-400">
            <li>
              <a href="mailto:alquil.ar.consultas@gmail.com" className="hover:underline">
                alquil.ar.consultas@gmail.com
              </a>
            </li>
            <li><a href="#" className="hover:underline">Instagram</a></li>
            <li><a href="#" className="hover:underline">Facebook</a></li>
            <li><a href="#" className="hover:underline">WhatsApp</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-8 text-xs text-center text-gray-500">
        © {new Date().getFullYear()} Alquil.ar. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
