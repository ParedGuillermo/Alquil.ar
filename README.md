# Alquil.ar - Plataforma para alquileres seguros y transparentes en Argentina

## Descripción

Alquil.ar es una aplicación web que facilita el acceso a alquileres confiables en Argentina, conectando directamente inquilinos y propietarios para promover transparencia y confianza en el mercado inmobiliario.

La plataforma permite buscar propiedades, visualizarlas en un mapa, y cargar nuevos anuncios con detalles completos, incluyendo fotos y ubicación. Además, protege la información de contacto para evitar fraudes, solicitando registro gratuito para acceder a datos sensibles.

---

## Funcionalidades implementadas

- **Home.jsx**: sección principal con Hero, botones para cargar propiedades y buscar, mapa con propiedades geolocalizadas, sección "Quiénes Somos", propiedades destacadas, y testimonios.
- **DetallePropiedad.jsx**: vista con detalles completos, galería de imágenes, mapa, características, y protección de datos de contacto mediante filtro para usuarios registrados.
- **Autenticación**: sistema de registro e inicio de sesión con Supabase, control de acceso a funciones clave.
- **Mapa interactivo**: muestra propiedades disponibles con marcadores que permiten navegación.
- **Carga de propiedades**: formulario para que usuarios registrados publiquen nuevos anuncios.
- **Navegación protegida**: rutas y botones que solicitan login/registro antes de acciones sensibles.
- **Diseño responsive**: experiencia optimizada para dispositivos móviles y desktop usando Tailwind CSS.
- **Animaciones suaves** con Framer Motion para mejorar la UX.

---

## Estructura clave

- `/src/pages/Home.jsx`: página principal con secciones dinámicas y mapa.
- `/src/pages/DetallePropiedad.jsx`: página para detalles de cada propiedad con seguridad en contacto.
- `/src/pages/CargarPropiedad.jsx`: formulario para cargar propiedades (requiere login).
- `/src/components/HeroSection.jsx`: sección hero con botones condicionados a autenticación.
- `/src/components/FeatureHighlights.jsx`, `TestimoniosSlider.jsx`, `Footer.jsx`: componentes de UI reutilizables.
- `/src/context/AuthContext.jsx`: manejo del estado de autenticación global.
- Backend: tablas `propiedades`, `usuarios` en Supabase para almacenamiento y autenticación.

---

## Próximos pasos

- Implementar subida y manejo de imágenes para propiedades con Supabase Storage.
- Mejorar validaciones en formularios y mensajes de error.
- Añadir filtros avanzados para búsqueda por ubicación, precio, características.
- Incorporar sistema de mensajería interna entre inquilinos y propietarios.
- Ampliar seguridad y accesos con roles diferenciados.
- Optimizar SEO y rendimiento para producción.
- Desarrollar página "Nosotros" con información institucional y contacto.
- Expandir testimonio y sistema de reseñas.

---

## Notas importantes

- El acceso a datos de contacto está restringido a usuarios registrados para prevenir fraudes.
- La plataforma es gratuita y busca generar confianza mediante transparencia y control.
- Se utiliza Supabase para backend (base de datos, autenticación y almacenamiento).
- El diseño está pensado para ser moderno, limpio y funcional, con enfoque mobile-first.

---

## Cómo retomar

- Revisar `/src/pages/Home.jsx` y `/src/components/HeroSection.jsx` para la navegación inicial y control de acceso.
- Seguir con `/src/pages/DetallePropiedad.jsx` para lógica de protección de datos y visualización.
- Continuar con `/src/pages/CargarPropiedad.jsx` para formulario de nuevos anuncios.
- Testear flujos de usuario autenticado y no autenticado.
- Mejorar experiencia móvil y accesibilidad.

---

## Tecnologías principales

- React 18 + Vite para frontend rápido y moderno.
- Tailwind CSS para diseño responsivo y estilizado.
- Supabase para backend: autenticación, base de datos PostgreSQL, y almacenamiento.
- Framer Motion para animaciones UI suaves.
- React Leaflet para mapas interactivos con OpenStreetMap.

---

¿Querés contribuir o reportar errores?  
Por favor abre un issue o PR en el repositorio.

---

© 2025 Alquil.ar — Todos los derechos reservados.
