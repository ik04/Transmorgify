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
          "-webkit-text-stroke-width": "1px",
        },
        ".text-stroke-sm": {
          "-webkit-text-stroke-width": "0.5px",
        },
        ".text-stroke-base": {
          "-webkit-text-stroke-width": "1px",
        },

        ".text-stroke-lg": {
          "-webkit-text-stroke-width": "2px",
        },
        ".text-stroke-xl": {
          "-webkit-text-stroke-width": "3px",
        },
        ".text-stroke-2xl": {
          "-webkit-text-stroke-width": "4px",
        },
        ".text-stroke-pinkMagenta": {
          "-webkit-text-stroke-color": "#FFA3FD",
        },
        ".text-stroke-heliotrope": {
          "-webkit-text-stroke-color": "#E384FF",
        },
        ".text-stroke-mediumSlateBlue": {
          "-webkit-text-stroke-color": "#865DFF",
        },
        ".text-stroke-main": {
          "-webkit-text-stroke-color": "#191825",
        },
      });
    },
  ],
};
