/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}", // Check this one, maybe you need it
    "./app/app_garcom_pdv/**/*.{js,jsx,ts,tsx}", // This one is the important one.
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}