/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"],
        display: ["Space Grotesk", "ui-sans-serif", "system-ui"]
      },
      colors: {
        brand: {
          50: "#f6f7ef",
          100: "#e6eacf",
          200: "#d1d9a6",
          300: "#b4c16f",
          400: "#99ad44",
          500: "#7a8b2c",
          600: "#5f6c1f",
          700: "#475116",
          800: "#31380f",
          900: "#191d07"
        },
        accent: "#ff7a59"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(15, 23, 42, 0.16)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(255,255,255,0.22), transparent 30%), radial-gradient(circle at bottom right, rgba(122,139,44,0.18), transparent 28%)"
      }
    }
  },
  plugins: []
};
