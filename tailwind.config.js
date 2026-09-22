/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        idh: {
          maroon: "#6E0E17",
          red: "#A50D1A",
          brightRed: "#C81C29",
          blush: "#D97E85",
          ink: "#23161A",
          gray: "#6B6B6B",
          paper: "#FAF5F3",
          card: "#FFFFFF",
          line: "#ECE1DE",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        solidBtn: '0 8px 20px -8px rgba(165,13,26,0.55)',
        cardHover: '0 20px 40px -20px rgba(110,14,23,0.35)',
      },
    },
  },
  plugins: [],
}
