/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': "#1476ff",
        'primary-light': '#f3f5ff',
        'Light': '#f9faff',
        'secondary': '#C7DEFA'
      }
    },
  },
  plugins: [],
}

