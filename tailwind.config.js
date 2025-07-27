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
          light: '#d1fae5',  // verde claro
          DEFAULT: '#34d399', // verde base (emerald-400)
          dark: '#059669',    // verde oscuro (emerald-600)
        },
        secondary: {
          light: '#bfdbfe',  // azul claro
          DEFAULT: '#3b82f6', // azul base
          dark: '#1e40af',    // azul oscuro
        },
        accent: {
          light: '#ddd6fe',  // púrpura claro
          DEFAULT: '#7c3aed', // púrpura medio
          dark: '#5b21b6',    // púrpura oscuro
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      screens: {
        xs: '375px',  // para iPhone SE y similares
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        xxl: '1440px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
