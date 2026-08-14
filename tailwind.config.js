/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        stone: {
          50: "#F6F7F1",
          100: "#EEF0E5",
          200: "#DCD5C4",
          300: "#C4BCA6",
        },
        pine: {
          DEFAULT: "#1F4A3D",
          50: "#E8EFEC",
          100: "#C7D9D1",
          400: "#2E6B57",
          600: "#183A30",
          900: "#102822",
        },
        gold: {
          DEFAULT: "#E08A2B",
          100: "#FBE7C9",
          400: "#E89A44",
          600: "#B96E1B",
        },
        clay: {
          DEFAULT: "#B5502F",
          600: "#8F3D22",
        },
        ink: {
          DEFAULT: "#22241F",
          soft: "#4A4C42",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Manrope", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      backgroundImage: {
        "mountain-fade":
          "linear-gradient(180deg, rgba(31,74,61,0) 0%, rgba(31,74,61,1) 100%)",
      },
    },
  },
  plugins: [],
};
