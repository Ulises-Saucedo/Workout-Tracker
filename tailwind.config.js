/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        'custom-black': '#141414',
        'custom-lightness-black': '#717171',
        'custom-primary': '#E0FF63',
        'custom-secondary': '#2BB89E'
      }
    },
    container: {
      center: true,
      screens: {
        lg: '1124px',
        xl: '1124px',
        '2xl': '1124px'
      }
    }
  },
  plugins: []
}
