import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleReportClick = () => {
    navigate("/mascotas-perdidas?reportar=true");
  };

  return (
    <motion.section
      role="banner"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-gradient-to-r from-primary-dark to-primary text-white py-12 px-6 sm:px-12 text-center shadow-xl rounded-3xl min-h-[300px] flex flex-col justify-center max-w-4xl mx-auto transform transition-transform duration-300 hover:scale-[1.02]"
    >
      <h1 className="mb-4 text-3xl font-extrabold leading-tight sm:text-4xl">
        ¿Tu mascota se ha perdido?
      </h1>
      <p className="max-w-xl mx-auto mb-8 text-base leading-relaxed sm:text-lg">
        Te ayudamos a encontrarla rápidamente con nuestra red y tecnología.
      </p>
      <button
        onClick={handleReportClick}
        aria-label="Reportar mascota perdida"
        type="button"
        className="px-8 py-3 mx-auto text-base font-semibold transition-transform duration-150 rounded-full shadow-md sm:text-lg bg-accent hover:bg-accent-dark active:scale-95 focus:outline-none focus:ring-4 focus:ring-accent-light"
      >
        Reportar mascota perdida
      </button>
    </motion.section>
  );
};

export default HeroSection;
