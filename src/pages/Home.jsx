import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

// Nuevo componente para Testimonios de la app
function TestimoniosHome() {
  const navigate = useNavigate();
  const [testimoniosApp, setTestimoniosApp] = useState([]);
  const [loadingAppTestimonios, setLoadingAppTestimonios] = useState(true);

  useEffect(() => {
    const fetchAppTestimonios = async () => {
      try {
        const { data, error } = await supabase
          .from("entradas_blog")
          .select("id, titulo, contenido, imagen_url")
          .eq("categoria", "Testimonios")
          .order("creado_en", { ascending: false })
          .limit(3);

        if (error) throw error;
        setTestimoniosApp(data || []);
      } catch (err) {
        console.error("Error cargando testimonios app:", err);
        setTestimoniosApp([]);
      } finally {
        setLoadingAppTestimonios(false);
      }
    };

    fetchAppTestimonios();
  }, []);

  if (loadingAppTestimonios) {
    return <p className="italic text-center text-gray-500">Cargando testimonios...</p>;
  }
  if (testimoniosApp.length === 0) {
    return <p className="italic text-center text-gray-500">No hay testimonios disponibles.</p>;
  }

  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {testimoniosApp.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.04, boxShadow: "0 15px 30px rgba(34, 197, 94, 0.3)" }}
          onClick={() => navigate(`/pet-society/historias`)} // Actualización aquí
          className="flex flex-col p-6 bg-white cursor-pointer select-none rounded-2xl"
        >
          <h3 className="mb-3 text-xl font-semibold text-green-700">{t.titulo}</h3>
          <p className="flex-grow text-sm leading-relaxed text-gray-700">
            {t.contenido?.slice(0, 160) || ""}...
          </p>
          {t.imagen_url && (
            <img
              src={t.imagen_url}
              alt={t.titulo}
              className="object-cover w-full h-48 mt-5 rounded-lg"
              loading="lazy"
              draggable={false}
            />
          )}
          <button className="self-start px-5 py-2 mt-6 text-sm font-semibold text-white transition bg-green-600 rounded-lg shadow-md hover:bg-green-700">
            Leer testimonio
          </button>
        </motion.div>
      ))}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [testimonios, setTestimonios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loadingTestimonios, setLoadingTestimonios] = useState(true);
  const [loadingProductos, setLoadingProductos] = useState(true);

  const sections = [
    {
      title: "Adopciones",
      description: "Encontrá a tu mejor amigo",
      detailedDescription:
        "Descubrí historias de adopciones y conocé los perfiles de animales que buscan un hogar. Fácil, rápido y seguro.",
      image: "/assets/home/adopciones.webp",
      link: "/adopciones",
    },
    {
      title: "Productos",
      description: "Los mejores productos para tu mascota",
      detailedDescription:
        "Desde alimentos hasta juguetes, accedé a productos seleccionados con la mejor calidad.",
      image: "/assets/home/productos.webp",
      link: "/productos",
    },
    {
      title: "Pet Society",
      description: "Consejos, cuidado y más",
      detailedDescription:
        "Leé artículos sobre salud, bienestar, entretenimiento y cuidado animal. Todo en un solo lugar.",
      image: "/assets/home/pet-society.webp",
      link: "/pet-society",
    },
    {
      title: "Historias de éxito",
      description: "Casos inspiradores de adopciones",
      detailedDescription:
        "Personas que cambiaron su vida al adoptar. Inspirate con sus historias.",
      image: "/assets/home/historias.webp",
      link: "/casos-exito",
    },
    {
      title: "Donaciones",
      description: "Ayudá a quienes ayudan",
      detailedDescription:
        "Contribuí a organizaciones protectoras de animales. Cada ayuda cuenta.",
      image: "/assets/home/donaciones.webp",
      link: "/donaciones",
    },
    {
      title: "Reportar Mascota Perdida",
      description: "Publicá un aviso en segundos",
      detailedDescription:
        "Si perdiste a tu mascota, cargá su foto, ubicación y datos para difundir el aviso y ayudar a encontrarla.",
      image: "/assets/home/perdida.webp",
      link: "/mascotas-perdidas",
    },
  ];

  useEffect(() => {
    const fetchTestimonios = async () => {
      try {
        const { data, error } = await supabase
          .from("entradas_blog")
          .select("id, titulo, contenido, imagen_url, categoria, autor, creado_en")
          .eq("categoria", "Historias")
          .order("creado_en", { ascending: false })
          .limit(3);

        if (error) throw error;
        setTestimonios(data || []);
      } catch (err) {
        console.error("Error cargando testimonios:", err);
        setTestimonios([]);
      } finally {
        setLoadingTestimonios(false);
      }
    };

    const fetchProductos = async () => {
      try {
        const { data, error } = await supabase
          .from("productos")
          .select("id, nombre, descripcion, foto_url, estado")
          .eq("estado", "disponible")
          .order("id", { ascending: false })
          .limit(6);

        if (error) throw error;
        setProductos(data || []);
      } catch (err) {
        console.error("Error cargando productos:", err);
        setProductos([]);
      } finally {
        setLoadingProductos(false);
      }
    };

    fetchTestimonios();
    fetchProductos();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, ease: "easeOut", duration: 0.5 },
    }),
    hover: { scale: 1.05, boxShadow: "0 12px 24px rgba(34, 197, 94, 0.3)" },
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gray-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative w-full h-screen bg-center bg-cover"
        style={{ backgroundImage: `url("/assets/home/hero.webp")` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative flex flex-col items-center justify-center h-full max-w-4xl px-6 mx-auto text-center text-white">
          <h1 className="mb-6 text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
            Bienvenido a <span className="text-green-500">Pet Link</span>
          </h1>
          <p className="max-w-xl mb-10 text-xl font-light drop-shadow-md">
            Conectamos a las personas con sus mascotas perfectas
          </p>
          <button
            onClick={() => navigate("/adopciones")}
            className="px-10 py-4 text-xl font-semibold transition rounded-full shadow-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 active:scale-95"
          >
            ¡Adoptar ahora!
          </button>
        </div>
      </motion.section>

      {/* Secciones principales */}
      <section className="max-w-screen-xl px-6 py-16 mx-auto">
        <h2 className="text-4xl font-extrabold tracking-tight text-center text-gray-900 mb-14">
          Explorá nuestras secciones
        </h2>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              custom={i}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={cardVariants}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => navigate(section.link)}
              className="relative flex flex-col overflow-hidden transition-transform bg-white shadow-lg cursor-pointer rounded-2xl ring-1 ring-gray-200"
            >
              <div className="flex flex-col lg:flex-row lg:space-x-8">
                <div className="flex-1 p-8 space-y-5">
                  <h3 className="text-3xl font-semibold text-green-700">{section.title}</h3>
                  <p className="mt-2 text-lg text-gray-600">{section.description}</p>
                  {hoveredIndex === i && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 font-medium leading-relaxed text-gray-700"
                    >
                      <p>{section.detailedDescription}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(section.link);
                        }}
                        className="px-6 py-2 mt-6 font-semibold text-white transition bg-green-600 rounded-lg shadow hover:bg-green-700"
                      >
                        Ir a {section.title}
                      </button>
                    </motion.div>
                  )}
                </div>
                <div className="flex items-center justify-center p-6 lg:w-2/5">
                  <motion.img
                    src={section.image}
                    alt={section.title}
                    className="object-contain w-full h-full rounded-lg pointer-events-none select-none"
                    loading="lazy"
                    style={{ objectPosition: "bottom right" }}
                    animate={{
                      x: hoveredIndex === i ? 15 : 0,
                      opacity: hoveredIndex === i ? 1 : 0.85,
                    }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonios */}
      <section className="max-w-screen-xl px-6 py-16 mx-auto shadow-lg bg-gray-50 rounded-3xl ring-1 ring-gray-200">
        <h2 className="mb-10 text-3xl font-extrabold tracking-tight text-center text-gray-900">
          Historias de nuestros usuarios
        </h2>

        {loadingTestimonios ? (
          <p className="italic text-center text-gray-500">Cargando testimonios...</p>
        ) : testimonios.length === 0 ? (
          <p className="italic text-center text-gray-500">No hay testimonios disponibles.</p>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {testimonios.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.04, boxShadow: "0 15px 30px rgba(34, 197, 94, 0.3)" }}
                onClick={() => navigate(`/pet-society/historias`)}  // Actualización aquí
                className="flex flex-col p-6 bg-white cursor-pointer select-none rounded-2xl"
              >
                <h3 className="mb-3 text-xl font-semibold text-green-700">{t.titulo}</h3>
                <p className="flex-grow text-sm leading-relaxed text-gray-700">
                  {t.contenido?.slice(0, 160) || ""}...
                </p>
                {t.imagen_url && (
                  <img
                    src={t.imagen_url}
                    alt={t.titulo}
                    className="object-cover w-full h-48 mt-5 rounded-lg"
                    loading="lazy"
                    draggable={false}
                  />
                )}
                <button className="self-start px-5 py-2 mt-6 text-sm font-semibold text-white transition bg-green-600 rounded-lg shadow-md hover:bg-green-700">
                  Leer historia
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Nueva sección Testimonios de nuestra app */}
      <section className="max-w-screen-xl px-6 py-16 mx-auto mt-12 shadow-lg bg-gray-50 rounded-3xl ring-1 ring-gray-200">
        <h2 className="mb-10 text-3xl font-extrabold tracking-tight text-center text-gray-900">
          Testimonios de nuestra app
        </h2>

        <TestimoniosHome />
      </section>

      {/* Beneficios */}
      <section className="max-w-screen-md px-6 py-16 mx-auto mt-16 text-center shadow-lg bg-green-50 rounded-3xl ring-1 ring-green-300">
        <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-gray-900">
          ¿Por qué elegir <span className="text-green-600">Pet Link</span>?
        </h2>
        <p className="mb-8 text-lg leading-relaxed text-gray-700">
          En Pet Link, facilitamos la adopción y conectamos a las personas con sus mascotas ideales.
          Además, ofrecemos productos y servicios de alta calidad para el bienestar animal.
        </p>
        <button
          onClick={() => navigate("/nosotros")}
          className="px-8 py-3 font-semibold text-white transition rounded-full shadow-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
        >
          Conocé más sobre nosotros
        </button>
      </section>

      {/* Productos */}
      <section className="max-w-screen-xl px-6 py-16 mx-auto mt-16 bg-white shadow-lg rounded-3xl ring-1 ring-gray-200">
        <h2 className="mb-10 text-3xl font-extrabold tracking-tight text-center text-gray-900">
          Artículos Populares
        </h2>

        {loadingProductos ? (
          <p className="italic text-center text-gray-500">Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p className="italic text-center text-gray-500">No hay productos disponibles.</p>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {productos.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(34, 197, 94, 0.3)" }}
                onClick={() => navigate(`/producto/${p.id}`)}
                className="flex flex-col p-6 cursor-pointer select-none bg-gray-50 rounded-2xl"
              >
                {p.foto_url && (
                  <img
                    src={p.foto_url}
                    alt={p.nombre}
                    className="object-cover w-full h-48 mb-6 rounded-xl"
                    loading="lazy"
                    draggable={false}
                  />
                )}
                <h3 className="text-xl font-semibold text-gray-900">{p.nombre}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-700">{p.descripcion || ""}</p>
                <button className="self-start px-5 py-2 mt-6 text-sm font-semibold text-white transition bg-green-600 rounded-lg shadow-md hover:bg-green-700">
                  Ver producto
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
