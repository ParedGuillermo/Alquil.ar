import React from "react";
import { useNavigate } from "react-router-dom";

const Nosotros = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen text-white bg-black">
      {/* Imagen de fondo suave */}
      <div
        className="absolute inset-0 bg-center bg-cover opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c')",
        }}
        aria-hidden="true"
      ></div>

      {/* Contenido sobre el fondo */}
      <div className="relative z-10 max-w-4xl p-8 mx-auto my-16 rounded-lg shadow-lg backdrop-blur-md bg-black/70">
        <h1 className="mb-10 text-5xl font-extrabold text-center">
          <span className="text-cyan-400">Alquileres Argentinos</span>{" "}
          <span className="text-yellow-400">"AlquilAr"</span>
        </h1>

        <section className="mb-10">
          <h2 className="mb-5 text-3xl font-semibold text-cyan-400">Quiénes somos</h2>
          <p className="mb-5 text-lg leading-relaxed">
            <strong>Alquileres Argentinos "AlquilAr"</strong> nace para atender una necesidad fundamental en el mercado inmobiliario: 
            brindar un espacio digital confiable, seguro y transparente para quienes buscan y ofrecen propiedades en alquiler en Argentina.
          </p>
          <p className="mb-5 text-lg leading-relaxed">
            Nuestra plataforma conecta directamente a propietarios e inquilinos, facilitando la publicación y búsqueda de propiedades con información clara y verificada.
            Nuestro compromiso es simplificar y profesionalizar el proceso de alquiler, otorgando confianza a ambas partes.
          </p>
          <p className="mb-5 text-lg leading-relaxed">
            Creemos que la tecnología debe ser un aliado para hacer del alquiler una experiencia accesible, justa y segura, especialmente para quienes se mudan a nuevas ciudades o inician su vida independiente.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-5 text-3xl font-semibold text-cyan-400">¿Cómo funciona?</h2>
          <p className="mb-5 text-lg leading-relaxed">
            En <strong>AlquilAr</strong>, los propietarios pueden publicar sus propiedades detalladamente con fotos, descripciones y ubicación exacta,
            para que los interesados puedan evaluar y contactar directamente.
          </p>
          <p className="mb-5 text-lg leading-relaxed">
            La plataforma actúa como un puente tecnológico, sin intervenir en la gestión contractual ni financiera. La responsabilidad final del acuerdo recae en las partes involucradas.
          </p>
          <p className="mb-5 text-lg leading-relaxed">
            Contamos con mecanismos de verificación y reporte para mejorar la seguridad y reducir riesgos en las operaciones realizadas a través de nuestro sitio.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-5 text-3xl font-semibold text-cyan-400">Compromiso con la seguridad</h2>
          <p className="mb-5 text-lg leading-relaxed">
            Aunque trabajamos para garantizar la mayor seguridad posible, <strong>AlquilAr no se responsabiliza por estafas, fraudes o incumplimientos</strong> entre usuarios.
            Recomendamos siempre verificar cuidadosamente la identidad del propietario y la existencia real de la propiedad antes de concretar pagos o contratos.
          </p>
          <p className="mb-5 text-lg italic leading-relaxed text-yellow-300">
            "Nuestra misión es brindarte las herramientas para que puedas alquilar con confianza y seguridad."
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-5 text-3xl font-semibold text-cyan-400">Contacto</h2>
          <p className="mb-6 text-lg leading-relaxed">
            Estamos para ayudarte con cualquier consulta o sugerencia que tengas. No dudes en comunicarte con nosotros para mejorar tu experiencia en la plataforma.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => navigate("/terminos-y-condiciones")}
              className="px-6 py-3 font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-400"
              aria-label="Ver términos y condiciones"
            >
              Términos y Condiciones
            </button>
            <button
              onClick={() => navigate("/contacto")}
              className="px-6 py-3 font-semibold bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-400"
              aria-label="Ir a contacto"
            >
              Contacto
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Nosotros;
