/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf7eb',
          100: '#f7e3bd',
          200: '#f1cf8f',
          300: '#eaba61',
          400: '#e4a633',
          500: '#c98c1a', // gold accent
          600: '#9d6d13',
          700: '#714e0d',
          800: '#453006',
          900: '#1b1101'
        }
      }
    }
  },
  plugins: []
};

