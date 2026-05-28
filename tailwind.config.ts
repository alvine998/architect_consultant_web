import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brown: {
          50: "#faf8f7",
          100: "#f5f1ed",
          200: "#e8ddd5",
          300: "#dcc8bc",
          400: "#c9a887",
          500: "#b8945a",
          600: "#a67d47",
          700: "#8b6639",
          800: "#6b5230",
          900: "#523e24",
          950: "#2d2417",
        },
      },
    },
  },
  plugins: [],
};
export default config;
