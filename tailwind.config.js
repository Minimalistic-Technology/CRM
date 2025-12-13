











/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customRed: "#FF6B6B",
      },
      screens: {
        mob: "375px",
        tab: "768px",
        lap: "1024px",
      },
    },
  },
  plugins: [],
};
