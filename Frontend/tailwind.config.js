/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-100": "#00E5FF",
        "primary-200": "#0D1117",
        "secondary-100": "#FF6B35",
        "secondary-200": "#FFD166",
      },
    },
  },
  plugins: [],
};
