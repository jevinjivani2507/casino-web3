/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        epilogue: ['Epilogue', 'sans-serif'],
      },
      boxShadow: {
        shadowSecondary: '10px 10px 20px rgba(2, 2, 2, 0.25)',
      },
      colors: {
        primary: '#E00109',
        secondary: '#1c1c24',
        background: '#2C2F32',
      },
    },
  },
  plugins: [],
}
