// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xxl: { max: "9999px" },
      "2xl": { max: "1535px" },
      xl: { max: "1280px" },
      lg: { max: "1024px" },
      slg: { max: "991px" },
      md: { max: "768px" },
      sm: { max: "540px" },
      xsm: { max: "385px" },
      xxsm: { max: "325px" },
    },
    extend: {
      colors: {
        primary: "#a359eb",
        btnHover: "#ededed",
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out", // Add fadeIn animation with duration
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },  // Start fully transparent
          "100%": { opacity: "1" }, // End fully opaque
        },
      },
    },
  },
  plugins: [],
};
