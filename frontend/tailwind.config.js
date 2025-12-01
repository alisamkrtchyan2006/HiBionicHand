/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#667eea',
          light: '#8fa3f0',
          dark: '#4a5fc7',
        },
        secondary: {
          DEFAULT: '#764ba2',
          light: '#9575cd',
          dark: '#5e3a7a',
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable Tailwind's base styles to avoid conflicts with MUI
  },
}

