/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xxl: { min: "1800px" },
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
    },
  },
  plugins: [],
};
