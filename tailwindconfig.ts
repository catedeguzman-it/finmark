import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#26C6DA',
          dark: '#2E2E2E',
          beige: '#f5f5f5',
          yellow: '#FFC107'
        }
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem'
      }
    }
  },
  plugins: []
};

export default config;
