/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media', // Modo oscuro basado en preferencia del sistema
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1E1E2F',
        'very-dark-bg': '#12131A',
        'electric-blue': '#2A7FFF',
        'violet-neon': '#9D4EDD',
        'light-gray': '#B0B3C6',
        'neon-pink': '#FF49DB',
        'neon-cyan': '#00FFF7',
      },
      boxShadow: {
        neon: '0 0 8px #FF49DB, 0 0 15px #FF49DB, 0 0 20px #FF49DB',
        'neon-cyan': '0 0 8px #00FFF7, 0 0 15px #00FFF7, 0 0 20px #00FFF7',
      },
      dropShadow: {
        'neon-pink': '0 0 5px #FF49DB',
        'neon-cyan': '0 0 5px #00FFF7',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        base: '0.875rem',  // 14px
        sm: '0.75rem',    // 12px
        lg: '1rem',       // 16px
        xl: '1.125rem',   // 18px
      },
      animation: {
        'pulse-slow': 'pulse 6s ease-in-out infinite',
        float: 'float 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
    screens: {
      'mobile': {'max': '480px'},
      'tablet': {'min': '481px', 'max': '768px'},
      'desktop': '769px',
    },
  },
  plugins: [],
};
