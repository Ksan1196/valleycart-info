/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D4A3E',
          light: '#3E6B52',
          dark: '#1F332B',
        },
        secondary: {
          DEFAULT: '#C88D74',
          light: '#D9A490',
          dark: '#B57A61',
        },
        background: '#F9F8F4',
        surface: '#EBEAE6',
        text: {
          primary: '#1A1A1A',
          secondary: '#4A4A4A',
          muted: '#888888',
        },
        success: '#3E6B46',
        warning: '#D9A34A',
        error: '#B93C3C',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        manrope: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}