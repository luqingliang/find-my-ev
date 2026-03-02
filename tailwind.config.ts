import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        mint: "#10b981",
        slate: "#f8fafc"
      },
      boxShadow: {
        panel: "0 10px 25px rgba(17,24,39,0.08)"
      }
    }
  },
  plugins: []
};

export default config;
