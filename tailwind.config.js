/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        macGreen: "#275317",
        macLilac: "#c4b5fd",
        macPink: "#f9a8d4"
      }
    },
  },
  plugins: [],
};
