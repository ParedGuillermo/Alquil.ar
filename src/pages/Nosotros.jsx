import React from "react";

export default function Nosotros() {
  return (
    <div className="max-w-4xl p-6 mx-auto my-12 bg-white shadow-md rounded-xl">
      <h1 className="mb-6 text-4xl font-bold text-center text-purple-800">
        Quiénes Somos
      </h1>

      {/* Mi Historia con Ares */}
      <section className="mb-10">
        <h2 className="mb-4 text-3xl font-semibold text-purple-700">Mi Historia con Ares</h2>
        <p className="text-lg leading-relaxed text-gray-700">
          Hola, soy Guillermo, fundador de Pets Link. Hace algunos años rescaté a mi compañero Ares, y desde entonces supe que quería ayudar a muchas más mascotas y sus familias.
          Ares llegó a mi vida en un momento difícil, y juntos construimos un vínculo lleno de amor y esperanza. Esa experiencia me inspiró a crear esta comunidad para que nadie tenga que vivir la angustia de perder a su mascota sin ayuda.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          Mi mayor deseo es que, a través de Pets Link, más personas puedan encontrar a sus amigos peludos y crear historias de rescate y reencuentro tan especiales como la nuestra.
        </p>
      </section>

      {/* Quiénes Somos */}
      <section className="mb-10">
        <h2 className="mb-4 text-3xl font-semibold text-purple-700">Quiénes Somos</h2>
        <p className="text-lg leading-relaxed text-gray-700">
          Pets Link es una plataforma creada para conectar a personas y mascotas, brindando herramientas y recursos para proteger, encontrar y cuidar a quienes más queremos.
          Somos una comunidad que trabaja día a día para facilitar el reencuentro de mascotas perdidas y promover el bienestar animal.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          Nuestro equipo está comprometido con la causa animal y con la creación de un espacio seguro y confiable para todos los usuarios.
        </p>
      </section>

      {/* Cómo Funciona */}
      <section className="mb-10">
        <h2 className="mb-4 text-3xl font-semibold text-purple-700">Cómo Funciona</h2>
        <p className="text-lg leading-relaxed text-gray-700">
          En Pets Link, podés reportar mascotas perdidas o encontradas, buscar en nuestra base de datos, y acceder a información útil para cuidarlas mejor.
          Además, contamos con funcionalidades para conectar organizaciones, ofrecer recursos y facilitar la donación para causas que benefician a los animales.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          Nuestra tecnología está diseñada para que encontrar a tu mascota sea más rápido y sencillo, con alertas, reportes geolocalizados, y una red colaborativa de usuarios.
        </p>
      </section>

      {/* Totalmente Gratuito */}
      <section className="mb-10">
        <h2 className="mb-4 text-3xl font-semibold text-purple-700">Totalmente Gratuito</h2>
        <p className="text-lg leading-relaxed text-gray-700">
          Queremos que la ayuda llegue a todos sin barreras, por eso Pets Link es completamente gratuito para todos sus usuarios.
          No cobramos por registrar mascotas, usar nuestras herramientas ni para acceder a la comunidad.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          Nuestro compromiso es con el bienestar animal y con que cada historia tenga un final feliz, sin importar quién seas ni dónde estés.
        </p>
      </section>

      {/* Invitación a Organizaciones */}
      <section className="mb-10">
        <h2 className="mb-4 text-3xl font-semibold text-purple-700">Organizaciones</h2>
        <p className="text-lg leading-relaxed text-gray-700">
          En Pets Link, las organizaciones dedicadas al cuidado y rescate animal pueden registrarse para formar parte de esta red colaborativa. Así, pueden compartir sus causas, recibir donaciones y llegar a más personas dispuestas a ayudar.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          Invitamos a todas las organizaciones a sumarse y trabajar juntos para que cada mascota tenga la oportunidad de encontrar un hogar lleno de amor.
        </p>
      </section>

      {/* Sección App Android con instrucciones */}
      <section className="p-6 mt-12 text-center bg-gray-100 shadow-md rounded-xl">
        <h2 className="mb-4 text-3xl font-semibold text-purple-700">¡Descargá nuestra App Android!</h2>
        <p className="mb-4 text-lg text-gray-700">
          Para facilitar aún más el cuidado y seguimiento de tus mascotas, contamos con una aplicación para dispositivos Android.
        </p>
        <a
          href="https://github.com/ParedGuillermo/Pet-link/releases/download/v1/Pets_link.apk"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 text-white transition bg-green-600 rounded-full hover:bg-green-700"
        >
          Descargar App Android
        </a>

        <div className="max-w-xl p-4 mx-auto mt-6 text-left bg-white border border-gray-300 rounded-lg">
          <h3 className="mb-2 text-xl font-semibold text-purple-700">Instrucciones para la instalación:</h3>
          <ol className="space-y-2 text-gray-700 list-decimal list-inside">
            <li>
              Al presionar "Descargar App Android", el archivo APK comenzará a descargarse en tu dispositivo.
            </li>
            <li>
              Es posible que aparezca un aviso indicando que el archivo podría ser dañino. Esto es normal para apps instaladas fuera de la Play Store.
            </li>
            <li>
              Luego de descargar, abrí el archivo APK para iniciar la instalación.
            </li>
            <li>
              Aparecerá un menú que recomienda analizar la app para mayor seguridad. Podés elegir "Analizar app" o "No instalar".
            </li>
            <li>
              Si elegís "Analizar app", verás un mensaje que te permitirá continuar con la instalación. Allí podrás presionar "Instalar" o "No instalar".
            </li>
            <li>
              Presioná "Instalar" para finalizar la instalación.
            </li>
            <li>
              Al terminar, podés abrir la app y comenzar a usarla normalmente.
            </li>
          </ol>
          <p className="mt-4 text-sm italic text-gray-500">
            Estas medidas son comunes en instalaciones manuales para proteger tu dispositivo. ¡Gracias por confiar en Pets Link!
          </p>
        </div>
      </section>
    </div>
  );
}
