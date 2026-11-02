/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          primary: '#F8F7F4', // Warm architectural stone
          card: '#FFFFFF',
          dark: '#111418',    // Charcoal slate
          darkElevated: '#1A1E24',
          muted: '#F1EFEA',
        },
        border: {
          subtle: '#E6E4DF',  // Travertine divider
          dark: '#2A3038',
        },
        bronze: {
          light: '#FBF7EE',
          DEFAULT: '#C5A059', // Champagne bronze
          dark: '#A37F38',
          deep: '#735722',
        },
        brandGreen: '#1B7A4D',
        brandRust: '#B84233',
        brandAmber: '#D9822B',
        brandIndigo: '#3E54AC'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
