/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 加入專屬字體
        sans: ['Urbanist', 'Noto Sans TC', 'sans-serif'],
      },
    },
  },
  plugins: [],
}