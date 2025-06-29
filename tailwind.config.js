/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './styles/**/*.css'],
  theme: {
    extend: {
      colors: {
        brand: {
          background: '#f5f5f5',
          text: '#2E2E2E',
          link: '#26C6DA',
        },
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
