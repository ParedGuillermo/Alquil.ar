// src/pages/TerminosYCondiciones.jsx
import React from "react";

export default function TerminosYCondiciones() {
  return (
    <div className="container max-w-4xl px-4 py-16 mx-auto text-textPrimary">
      <h1 className="mb-8 text-4xl font-bold text-center text-primary">Términos y Condiciones</h1>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">1. Objeto</h2>
        <p>
          Estas condiciones regulan el acceso y uso del sitio web Alquil.ar y todos los servicios ofrecidos en él. El uso del sitio implica la aceptación plena y sin reservas de estas condiciones.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">2. Uso y acceso</h2>
        <p>
          El acceso y uso de los servicios son responsabilidad exclusiva del usuario. Está prohibido utilizar el sitio para fines ilegales, fraudulentos o que violen derechos de terceros.
        </p>
        <p>
          Nos reservamos el derecho de suspender, limitar o cancelar el acceso ante incumplimientos de estas condiciones o por razones legales.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">3. Propiedad Intelectual</h2>
        <p>
          Todos los contenidos, gráficos, textos, marcas y diseños son propiedad exclusiva de Alquil.ar o terceros que han autorizado su uso.
          Queda prohibida la reproducción, distribución o modificación sin autorización expresa.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">4. Responsabilidades y limitaciones</h2>
        <p>
          Alquil.ar no garantiza la disponibilidad, exactitud o veracidad de los contenidos publicados por usuarios o terceros.
          No nos responsabilizamos por daños directos, indirectos o consecuentes derivados del uso o imposibilidad de uso del sitio.
        </p>
        <p>
          Los usuarios aceptan utilizar la plataforma bajo su propio riesgo y responsabilidad.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">5. Protección de Datos Personales</h2>
        <p>
          En cumplimiento con la Ley N° 25.326 de Protección de Datos Personales de Argentina, informamos que los datos personales que proporcione el usuario serán utilizados exclusivamente para la finalidad establecida en la política de privacidad.
          Los usuarios pueden ejercer los derechos de acceso, rectificación, cancelación y oposición (ARCO) comunicándose a <a href="mailto:alquil.ar.consultas@gmail.com" className="underline text-cyan-600">alquil.ar.consultas@gmail.com</a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">6. Ley Aplicable y Jurisdicción</h2>
        <p>
          Estas condiciones se rigen por la legislación vigente en la República Argentina. Cualquier controversia será sometida a la jurisdicción de los tribunales ordinarios con competencia en la Ciudad Autónoma de Buenos Aires.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-semibold">Contacto</h2>
        <p>
          Para consultas sobre estos términos, puede contactarnos a través del correo electrónico <a href="mailto:alquil.ar.consultas@gmail.com" className="underline text-cyan-600">alquil.ar.consultas@gmail.com</a>.
        </p>
      </section>
    </div>
  );
}
