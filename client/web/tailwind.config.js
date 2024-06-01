/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Lato", "sans"],
        base: ["Lacquer", "sans"],
      },
      colors: {
        main: "#191825",
        pinkMagenta: "#FFA3FD",
        heliotrope: "#E384FF",
        mediumSlateBlue: "#865DFF",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".text-stroke": {
          "-webkit-text-stroke": "1px",
        },
        ".text-stroke-sm": {
          "-webkit-text-stroke": "0.5px",
        },
        ".text-stroke-lg": {
          "-webkit-text-stroke": "2px",
        },
      });
    },
  ],
};
