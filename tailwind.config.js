const twColors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/index.html',
    './src/**/*.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        primary: twColors['sky'][600]
      }
    }
  },
  plugins: []
};
