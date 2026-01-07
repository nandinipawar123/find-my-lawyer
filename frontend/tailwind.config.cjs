/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        navy: '#1A237E',
        blue: '#1976D2',
        orange: '#FF6F00',
        copper: '#B87333',
      },
    },
  },
  plugins: [],
};
