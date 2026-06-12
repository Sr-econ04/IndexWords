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
        // はば単カラーパレット（兵庫・海・空をイメージ）
        primary: {
          50:  "#eef6ff",
          100: "#d9ecff",
          200: "#bbdbff",
          300: "#8ac2ff",
          400: "#549fff",
          500: "#2878f0",
          600: "#1a5fd4",
          700: "#1a4bab",
          800: "#1c3f8a",
          900: "#1b3770",
        },
        accent: {
          DEFAULT: "#f97316", // オレンジ（正解マーカー）
          light: "#fff7ed",
        },
        surface: "#f8fafc",
        card: "#ffffff",
      },
      fontFamily: {
        sans: ["'Noto Sans JP'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
