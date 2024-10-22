/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        loading: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        loading: "loading 1s ease-in-out infinite",
      },
      daisyui: {
        themes: ["light", "dark", "cupcake"],
      },

      boxShadow: {
        customShadow:
          "rgba(0, 0, 0, 0.03) 0px 2px 1px, rgba(0, 0, 0, 0.03) 0px 4px 2px, rgba(0, 0, 0, 0.03) 0px 8px 4px, rgba(0, 0, 0, 0.03) 0px 16px 8px, rgba(0, 0, 0, 0.03) 0px 32px 16px",
        customShadow2: "inset 0px 0px 6px 5px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [require("daisyui")],
};
