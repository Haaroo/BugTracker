import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f1f0ff",
          100: "#e4e1fe",
          200: "#cdc7fd",
          300: "#ab9ffa",
          400: "#8770f5",
          500: "#6d4aee",
          600: "#5d33e0",
          700: "#4d27c2",
          800: "#40219d",
          900: "#361f7d",
        },
        surface: {
          50: "#f8f9fb",
          100: "#eef0f4",
          200: "#dfe3ea",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)",
        popover: "0 10px 15px -3px rgb(15 23 42 / 0.1), 0 4px 6px -4px rgb(15 23 42 / 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
