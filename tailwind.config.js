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
      },
    },
  },
  plugins: [],
};
