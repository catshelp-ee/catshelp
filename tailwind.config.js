/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slideDown: {
          "0%": { transform: "translate(-50%, -80%)", opacity: "0" },
          "100%": { transform: "translate(-50%, 0)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateX(0) translateY(0)" },
          "100%": { transform: "translateX(0) translateY(-100%)" },
        },
        slideLeft: {
          "0%": { width: "100%" },
          "100%": { width: "0" },
        },
        slideRight: {
          "0%": { width: "25%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        "slide-down": "slideDown 0.3s ease-in",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-right": "slideRight 0.2s linear forwards",
        "slide-left": "slideLeft 0.2s linear forwards",
      },
      colors: {
        secondaryText: "#82869E",
      },
    },
  },
  plugins: [],
};
