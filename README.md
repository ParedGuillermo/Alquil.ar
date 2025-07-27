# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




# Proyecto Pet Link - Resumen y Progreso

## Funcionalidades implementadas

- Home.jsx: muestra Hero, botones, carruseles de mascotas en adopción y productos esenciales con datos traídos desde Supabase.
- Componentes FeaturedPets y EsencialesCarousel con fetch y renderizado responsivo horizontal (carrusel scrollable).
- Perfil de usuario con carga de datos desde Supabase (usuarios y mascotas asociadas).
- Formulario básico para agregar nuevas mascotas desde Perfil, asociadas automáticamente al usuario.
- Navegación con rutas protegidas y menú inferior dinámico (BottomNav).
- Manejo básico de autenticación con contexto AuthContext.

## Estructura clave

- `/src/pages/Profile.jsx`: perfil usuario y listado + agregado mascotas.
- `/src/components/FeaturedPets.jsx` y `/src/components/EsencialesCarousel.jsx`: carruseles.
- `/src/components/BottomNav.jsx`: navegación inferior con sección admin condicional.
- Backend: tablas `usuarios`, `mascotas`, `productos` en Supabase.

## Pendientes / Próximos pasos

- Reemplazar el formulario fijo en Perfil por un modal para agregar mascotas.
- Implementar subida de imágenes para mascotas (Supabase Storage).
- Mejorar validaciones y UX del formulario.
- Continuar con páginas de tienda y adopciones.
- Revisar y ajustar responsividad general y accesibilidad.

---

## Notas

- El modal facilitará mejor experiencia y evitará recargar la página o secciones enteras.
- Subir imágenes implica manejar archivos y previsualización, importante para UI.
- Controlar permisos y seguridad para edición y asociación de mascotas.

---

## Para retomar

- Revisar `/src/pages/Profile.jsx` en la sección de agregar mascota.
- Implementar modal y sistema de upload.
- Testear flujos de usuario para agregar, editar y visualizar mascotas.
