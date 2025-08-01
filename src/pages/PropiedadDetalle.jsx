import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useAuth } from "../hooks/useAuth";

const markerIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const DetallePropiedad = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [propiedad, setPropiedad] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const { isLoggedIn } = useAuth();

  // Modal de registro activo solo si NO está logueado
  const [showModal, setShowModal] = useState(!isLoggedIn);

  useEffect(() => {
    const fetchPropiedadYUsuario = async () => {
      const { data, error } = await supabase
        .from("propiedades")
        .select(`
          *,
          usuario:usuario_id (
            id,
            nombre,
            verificado
          )
        `)
        .eq("id", id)
        .single();

      if (!error) {
        setPropiedad(data);
        setUsuario(data.usuario || null);
        parseContacto(data.contacto);
      } else {
        console.error(error);
      }
    };

    fetchPropiedadYUsuario();
  }, [id]);

  useEffect(() => {
    // Si el usuario se loguea mientras está en esta página, ocultar modal
    if (isLoggedIn) setShowModal(false);
    else setShowModal(true);
  }, [isLoggedIn]);

  const parseContacto = (contacto) => {
    if (!contacto) return;

    const emailRegex = /[\w.+-]+@[\w-]+\.[\w.-]+/i;
    const foundEmail = contacto.match(emailRegex);
    setEmail(foundEmail ? foundEmail[0] : null);

    const phoneRegex = /(\+?\d[\d\s-]{6,}\d)/;
    const foundPhone = contacto.match(phoneRegex);
    setPhone(foundPhone ? foundPhone[0].replace(/\s+/g, "") : null);
  };

  if (!propiedad)
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-textPrimary">
        <p className="text-lg select-none">Cargando...</p>
      </div>
    );

  return (
    <>
      {/* Contenido principal con blur y no clickable si modal activo */}
      <div
        className={`max-w-5xl min-h-screen px-6 py-8 mx-auto bg-background text-textPrimary transition-filter duration-300 ${
          showModal ? "pointer-events-none filter blur-sm select-none" : ""
        }`}
      >
        {/* Título y dirección */}
        <h1 className="mb-4 text-4xl font-bold text-white">{propiedad.titulo}</h1>
        <p className="mb-2 text-lg text-cyan-400">{propiedad.direccion}</p>

        {/* Nombre usuario y verificado */}
        {usuario && (
          <div className="flex items-center mb-6 space-x-2">
            <span className="font-semibold text-white">Dueño: {usuario.nombre || "Sin nombre"}</span>
            {usuario.verificado && (
              <span
                className="flex items-center px-2 py-1 text-sm font-semibold text-green-800 bg-green-300 rounded"
                title="Usuario verificado"
                aria-label="Usuario verificado"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Verificado
              </span>
            )}
          </div>
        )}

        {/* Imágenes */}
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 md:grid-cols-3">
          {(propiedad.imagen_url || []).map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Imagen propiedad ${i + 1}`}
              className="object-cover w-full h-48 rounded-lg shadow-lg"
              loading="lazy"
            />
          ))}
        </div>

        {/* Descripción */}
        <p className="mb-8 text-gray-300 whitespace-pre-line">{propiedad.descripcion}</p>

        {/* Mapa */}
        {propiedad.latitud && propiedad.longitud && (
          <div className="h-64 mb-8 overflow-hidden rounded-lg shadow-lg">
            <MapContainer
              center={[propiedad.latitud, propiedad.longitud]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[propiedad.latitud, propiedad.longitud]} icon={markerIcon}>
                <Popup>{propiedad.titulo}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* Datos principales */}
        <section className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2">
          <div className="p-4 bg-gray-800 rounded-lg shadow">
            <h3 className="mb-2 font-semibold text-white">Detalles Generales</h3>
            <ul className="text-gray-300">
              <li>
                <strong>Precio:</strong> ${propiedad.precio.toLocaleString("es-AR")}
              </li>
              <li>
                <strong>Tipo:</strong> {propiedad.tipo}
              </li>
              <li>
                <strong>Gestión:</strong> {propiedad.gestion}
              </li>
              <li>
                <strong>Fecha de Publicación:</strong>{" "}
                {propiedad.fecha_publicacion
                  ? new Date(propiedad.fecha_publicacion).toLocaleDateString("es-AR")
                  : "No disponible"}
              </li>
              <li>
                <strong>Fecha de Ingreso:</strong>{" "}
                {propiedad.fecha_ingreso
                  ? new Date(propiedad.fecha_ingreso).toLocaleDateString("es-AR")
                  : "No disponible"}
              </li>
            </ul>
          </div>

          <div className="p-4 bg-gray-800 rounded-lg shadow">
            <h3 className="mb-2 font-semibold text-white">Características</h3>
            <ul className="text-gray-300">
              <li>
                <strong>Habitaciones:</strong> {propiedad.habitaciones}
              </li>
              <li>
                <strong>Superficie:</strong> {propiedad.superficie} m²
              </li>
              <li>
                <strong>Permiten mascotas:</strong> {propiedad.permiten_mascotas ? "Sí" : "No"}
              </li>
              <li>
                <strong>Permiten niños:</strong> {propiedad.permiten_ninos ? "Sí" : "No"}
              </li>
              <li>
                <strong>Servicios incluidos:</strong> {propiedad.servicios_incluidos ? "Sí" : "No"}
              </li>
              <li>
                <strong>Amoblado:</strong> {propiedad.amoblado ? "Sí" : "No"}
              </li>
            </ul>
          </div>
        </section>

        {/* Botones de contacto */}
        {isLoggedIn && (
          <section className="flex flex-col gap-4 mb-8 sm:flex-row">
            {phone && (
              <button
                onClick={() =>
                  window.open(`https://wa.me/${phone.replace(/\D/g, "")}`, "_blank")
                }
                className="flex-1 px-6 py-3 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                aria-label="Contactar por WhatsApp"
              >
                Enviar WhatsApp
              </button>
            )}

            {email && (
              <button
                onClick={() => window.open(`mailto:${email}`, "_blank")}
                className="flex-1 px-6 py-3 font-semibold text-white transition rounded-lg bg-cyan-600 hover:bg-cyan-700"
                aria-label="Enviar correo electrónico"
              >
                Enviar correo
              </button>
            )}
          </section>
        )}
      </div>

      {/* Modal overlay */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 py-6 bg-black bg-opacity-60"
        >
          <div className="max-w-md p-6 text-center text-yellow-900 bg-yellow-100 rounded-lg shadow-lg">
            <p className="mb-6 text-lg">
              Debe estar registrado para poder acceder a la información de contacto.
              Es una manera de garantizar la transparencia y evitar fraudes.<br />
              El registro es libre y gratuito y nos ayuda a reforzar la seguridad de la web.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 font-semibold text-white rounded-lg bg-cyan-600 hover:bg-cyan-700"
            >
              Iniciar sesión / Registrarse
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DetallePropiedad;
