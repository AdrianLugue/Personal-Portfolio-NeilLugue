/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        montserrat: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      colors: {
        portfolio: {
          bg: '#000000',
          card: '#121212',
          cardBorder: '#2A2A2A',
          gold: '#C6B99B',
          bronze: '#7F7255',
          bronzeBg: 'rgba(127, 114, 85, 0.5)',
          muted: '#7E7E7E',
          accent: '#59533C'
        }
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #B3A88D 100%)',
        'fade-bottom': 'linear-gradient(180deg, rgba(0, 0, 0, 0.36) 0%, #000000 100%)'
      }
    },
  },
  plugins: [],
}
