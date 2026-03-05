import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: "#F5D06A",
          DEFAULT: "#C9A84C",
          dark: "#8B6914",
          deep: "#5C4500",
        },
        dark: {
          DEFAULT: "#050505",
          2: "#0F0F0F",
          3: "#141414",
        },
        cream: "#FAF6EE",
        white: {
          DEFAULT: "#F8F8F8",
          soft: "#E8E8E8",
        },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
      },
      fontSize: {
        "display": ["clamp(3rem, 8vw, 6rem)", { lineHeight: "1.1" }],
        "h1": ["clamp(2.5rem, 5vw, 4.5rem)", { lineHeight: "1.15" }],
        "h2": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.2" }],
        "h3": ["clamp(1.25rem, 2vw, 1.75rem)", { lineHeight: "1.3" }],
      },
      spacing: {
        "section": "120px",
        "section-md": "80px",
        "section-sm": "60px",
      },
      letterSpacing: {
        label: "0.2em",
      },
      animation: {
        "ticker": "ticker 30s linear infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
