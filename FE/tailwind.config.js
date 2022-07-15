/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./atomics/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        "book-image-width-small": "140px",
        "book-image-width": "170px",
        "container": "600px",
      },
    },
    colors: {
      ...colors,
    },
    maxWidth: {
      "600": "600px",
      "450": "450px"
    }
  },
  plugins: [],
};
