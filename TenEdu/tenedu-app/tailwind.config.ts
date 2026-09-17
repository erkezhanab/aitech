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
        primary: {
          50: "#e8f0fa",
          100: "#c5d9f2",
          200: "#9fc0e9",
          300: "#79a7e0",
          400: "#5c93da",
          500: "#3f7fd3",
          600: "#2e6bbf",
          700: "#1e3a5f",
          800: "#172e4d",
          900: "#0f203a",
        },
        accent: {
          50: "#fffcf0",
          100: "#fff5dd",
          200: "#ffedc2",
          300: "#ffe5a6",
          400: "#fdd878",
          500: "#f5a623",
          600: "#d48a1a",
          700: "#b36f13",
          800: "#92550d",
          900: "#723c08",
        },
        success: "#22c55e",
        warning: "#f59e0b",
        error: "#ef4444",
        bg: "#fafafa",
        text: {
          primary: "#2d3436",
          secondary: "#636e72",
          light: "#b2bec3",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        dyslexic: ["OpenDyslexic", "Comic Sans MS", "cursive"],
      },
      fontSize: {
        base: ["1rem", { lineHeight: "1.6" }],
        lg: ["1.125rem", { lineHeight: "1.7" }],
        xl: ["1.25rem", { lineHeight: "1.7" }],
        "2xl": ["1.5rem", { lineHeight: "1.6" }],
        "3xl": ["1.875rem", { lineHeight: "1.5" }],
        "4xl": ["2.25rem", { lineHeight: "1.4" }],
      },
      spacing: {
        "touch": "44px",
      },
      borderRadius: {
        sm: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.5rem",
        card: "1rem",
        button: "0.5rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 4px 12px rgba(0, 0, 0, 0.12)",
        glow: "0 0 0 3px rgba(245, 166, 35, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
