// src/components/FeatureHighlights.jsx
import React from "react";
import { CheckCircle } from "lucide-react";

const features = [
  "Encontrá propiedades en alquiler en toda Corrientes.",
  "Contactá directamente con los dueños o inmobiliarias.",
  "Seguí tus conversaciones desde un mismo lugar.",
  "Buscá por ubicación, tipo de propiedad y más."
];

const FeatureHighlights = () => {
  return (
    <section className="px-4 py-8 bg-white">
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">¿Por qué usar Alquil.ar?</h2>
      <ul className="grid max-w-4xl gap-4 mx-auto sm:grid-cols-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-3">
            <CheckCircle className="mt-1 text-green-600" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FeatureHighlights;
