/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        surface: '#141416',
        border: '#232326',
        emerald: { DEFAULT: '#10b981' },
        indigo: { DEFAULT: '#6366f1' },
        amber: { DEFAULT: '#f59e0b' },
        rose: { DEFAULT: '#f43f5e' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
