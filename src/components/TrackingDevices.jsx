import React from 'react';

const TrackingDevices = () => (
  <section className="px-4">
    <h2 className="mb-4 text-2xl font-semibold text-center">Dispositivos de Rastreo</h2>

    <div className="space-y-6">
      {/* Dispositivo actual (Códigos QR) */}
      <div className="p-4 text-center transition-shadow duration-300 bg-gray-100 rounded-lg shadow-sm hover:shadow-md">
        <h3 className="mb-2 font-semibold">Códigos QR de Rastreo</h3>
        <p className="text-sm text-gray-700">Ideal para mascotas. Fácil escaneo para rastrear en tiempo real.</p>
        <img
          src="https://zcoekpdxfbnooopsrrec.supabase.co/storage/v1/object/public/productos//dc60f746-49cc-41cb-8e86-e82a550b8f94.jpg"
          alt="Código QR"
          className="object-cover w-32 h-32 mx-auto mt-4 rounded-full"
          loading="lazy"
        />
        <div className="mt-4">
          <a
            href="https://wa.me/5491133380557?text=Hola,%20me%20interesa%20obtener%20un%20código%20QR%20para%20mi%20mascota"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Solicitar código QR para mi mascota vía WhatsApp"
            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
          >
            Solicitar Código
          </a>
        </div>
      </div>

      {/* Dispositivo futuro (Tags tipo AirTag) */}
      <div className="p-4 text-center transition-shadow duration-300 bg-gray-100 rounded-lg shadow-sm hover:shadow-md">
        <h3 className="mb-2 font-semibold">AirTags y Dispositivos Similares</h3>
        <p className="text-sm text-gray-700">Próximamente podrás rastrear a tu mascota con dispositivos como AirTag, Moto Tag, Galaxy Smart Tag, y más.</p>
        <img
          src="https://media.revistagq.com/photos/66bf16c66e782664741cc287/4:3/w_1440,h_1080,c_limit/I%20migliori%20smart%20tag%20per%20sapere%20sempre%20dove%20sono%20le%20tue%20valigie.jpg"
          alt="AirTag"
          className="object-cover w-32 h-32 mx-auto mt-4 rounded-full"
          loading="lazy"
        />
      </div>
    </div>
  </section>
);

export default TrackingDevices;
