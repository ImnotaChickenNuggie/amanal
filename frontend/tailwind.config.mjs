/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        abismo: "#0a0d0f",
        obsidiana: "#131a1e",
        corteza: "#1c2428",
        raiz: "#2a3338",
        niebla: "#e2ded6",
        musgo: "#8a9a8e",
        manantial: "#5ec4b6",
        reflejo: "#7dd8cc",
        resina: "#c4a24e",
        fuego: "#d45a3a",
      },
      fontFamily: {
        makes: ["Makes", "sans-serif"],
        product: ["Product Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backdropBlur: {
        glass: "16px",
      },
    },
  },
  plugins: [],
};
