/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-primary': '#646cff',
        'game-secondary': '#535bf2',
      }
    },
  },
  plugins: [],
}