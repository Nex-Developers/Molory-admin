/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    `./components/**/*.{vue,js,ts}`,
    `./layouts/**/*.vue`,
    `./pages/**/*.vue`,
    `./composables/**/*.{js,ts}`,
    `./plugins/**/*.{js,ts}`,
    `./App.{js,ts,vue}`,
    `./app.{js,ts,vue}`,
    `./Error.{js,ts,vue}`,
    `./error.{js,ts,vue}`
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF1E00",
        secondary: "#001317",
        tertiary: "#FFB400",
        dark: "#000",
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
