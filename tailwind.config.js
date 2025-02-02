/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/**/*.tsx', // Adjust for React/TSX files
    './src/**/*.jsx',
    './src/**/*.js',
    './public/index.html'
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}