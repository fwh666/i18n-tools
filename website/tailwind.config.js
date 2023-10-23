/** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
module.exports = {
  purge: ['./src/**/*.html', './src/**/*.js', './src/**/*.tsx'],
  darkMode: false, 
  theme: {},
  variants: {
      extend: {},
  },
  plugins: []
}