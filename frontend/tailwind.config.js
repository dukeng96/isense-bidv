/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          500: '#6d28d9', // violet-600
          600: '#5b21b6', // violet-700
          700: '#4c1d95', // violet-800
        }
      }
    },
  },
  plugins: [],
}
