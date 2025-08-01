import React from "react";
import { motion } from "framer-motion";

const testimonios = [
  {
    nombre: "María G.",
    texto: "Encontré mi dpto ideal en Corrientes gracias a Alquil.ar. Súper fácil.",
  },
  {
    nombre: "Carlos T.",
    texto: "Publicar mi propiedad fue rápido y sin vueltas. Recomendado.",
  },
  {
    nombre: "Lucía M.",
    texto: "La atención por WhatsApp fue rápida y clara. Muy buena experiencia.",
  },
];

const TestimoniosSlider = () => {
  return (
    <section
      className="py-12 bg-gray-100"
      aria-labelledby="testimonios-title"
      role="region"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2
          id="testimonios-title"
          className="mb-8 text-3xl font-semibold text-gray-900"
        >
          Testimonios reales
        </h2>
        <div className="grid gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonios.map((item, i) => (
            <motion.blockquote
              key={i}
              className="flex flex-col justify-between p-6 bg-white shadow-lg rounded-xl"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              tabIndex={0}
              aria-label={`Testimonio de ${item.nombre}`}
            >
              <p className="mb-6 text-lg italic leading-relaxed text-gray-700">
                “{item.texto}”
              </p>
              <footer className="text-sm font-semibold text-gray-900">
                — {item.nombre}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimoniosSlider;
