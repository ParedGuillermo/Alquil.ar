/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#6b7280', // Gris claro para detalles suaves
          DEFAULT: '#1f2937', // Gris oscuro (similar al fondo de Netflix)
          dark: '#111827', // Gris muy oscuro, casi negro
        },
        secondary: {
          light: '#3b82f6', // Azul claro
          DEFAULT: '#2563eb', // Azul base (para botones y links)
          dark: '#1e40af', // Azul oscuro
        },
        accent: {
          light: '#fbbf24', // Amarillo suave para destacar
          DEFAULT: '#f59e0b', // Amarillo oscuro (para énfasis)
          dark: '#b45309', // Amarillo fuerte
        },
        background: '#0f172a', // Fondo oscuro general
        textPrimary: '#e5e7eb', // Texto primario claro
        textSecondary: '#9ca3af', // Texto secundario gris claro
        borderColor: '#374151', // Borde suave gris oscuro
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      screens: {
        xs: '375px', // Para iPhone SE
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        xxl: '1440px',
        '2xl': '1536px',
      },
      container: {
        center: true, // Centra el contenedor
        padding: '1rem', // Padding para dispositivos pequeños
        screens: {
          sm: '100%',
          md: '90%',
          lg: '80%',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
