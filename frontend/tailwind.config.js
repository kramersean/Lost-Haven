/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          purple: '#9f7aea',
          teal: '#2dd4bf',
          red: '#f472b6',
        },
        night: '#0b0c10',
        gunmetal: '#1f2833',
      },
      boxShadow: {
        glow: '0 0 20px rgba(157, 78, 221, 0.4)',
      },
    },
  },
  plugins: [],
};
