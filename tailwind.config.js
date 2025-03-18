/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/david-ui-angular/**/*.{html,ts,js,mjs}",
  ],
  theme: {
    extend: {
      colors: {
        "blanco-no-puro": "#F5F5F5",
        "gaucho-buy-inicio": "#4472AF",
        "gaucho-buy-fin": "#265DA5",
        "gaucho-buy-texto": "#D4E3F0",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
