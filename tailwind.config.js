/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lab: {
          white: '#F8FAFC', // Lab Coat White
          mint: '#A7F3D0',  // Fresh Mint
          citrus: '#FDBA74', // Citrus Orange
          water: '#BAE6FD', // Water Blue
          text: '#334155',  // Slate 700
          dark: '#0F172A',  // Slate 900
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}