/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all your React files for class names
  ],
  theme: {
    extend: {}, // You can customize the theme here later
  },
  plugins: [], // Add Tailwind plugins here if needed
}
