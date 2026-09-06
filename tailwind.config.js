/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          600: '#102a43',
          700: '#0b69a3',
          800: '#034375',
          900: '#0b2038',
        },
        bhoomi: {
          saffron: '#d97706',
          green: '#047857',
          navy: '#0f172a',
          ash: '#f8fafc',
          gold: '#b45309',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
