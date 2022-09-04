/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./assets/**/*.css",
    "./components/*.{vue,js}",
    "./components/**/*.{vue,js}",
    "./pages/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./*.{vue,js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF1E00",
        secondary: "#001317",
        tertiary: "#FFB400",
        dark: "",
        light: "#FFFFFF",
        medium: "#F8F8F8",
        info: "#1132ff",
        danger: "#b31300",
        warning: "",
        success: "#00b333"
      }
    },
  },
  plugins: [],
}
