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
        surface: {
          DEFAULT: "#080808",
          card: "rgba(255,255,255,0.04)",
          "card-hover": "rgba(255,255,255,0.06)",
          border: "rgba(255,255,255,0.06)",
          "border-active": "rgba(255,255,255,0.12)",
        },
        text: {
          primary: "#ffffff",
          secondary: "rgba(255,255,255,0.55)",
          tertiary: "rgba(255,255,255,0.35)",
          muted: "rgba(255,255,255,0.2)",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["DM Sans", "system-ui", "sans-serif"],
      },
      animation: {
        "drift-1": "drift1 8s ease-in-out infinite",
        "drift-2": "drift2 10s ease-in-out infinite",
        "drift-3": "drift3 7s ease-in-out infinite",
        "drift-4": "drift4 11s ease-in-out infinite",
        "drift-5": "drift5 9s ease-in-out infinite",
      },
      keyframes: {
        drift1: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(220px, -140px) scale(1.2)" },
          "50%": { transform: "translate(100px, 110px) scale(0.85)" },
          "75%": { transform: "translate(-160px, 50px) scale(1.1)" },
        },
        drift2: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(-190px, 130px) scale(1.25)" },
          "50%": { transform: "translate(-80px, -180px) scale(0.8)" },
          "75%": { transform: "translate(150px, -50px) scale(1.15)" },
        },
        drift3: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(170px, 160px) scale(1.3)" },
          "66%": { transform: "translate(-140px, -80px) scale(0.75)" },
        },
        drift4: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "30%": { transform: "translate(-200px, -110px) scale(1.15)" },
          "60%": { transform: "translate(120px, -160px) scale(0.85)" },
          "85%": { transform: "translate(80px, 90px) scale(1.1)" },
        },
        drift5: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "40%": { transform: "translate(180px, 90px) scale(1.2)" },
          "70%": { transform: "translate(-100px, 150px) scale(0.8)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
