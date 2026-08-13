/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Soft darks that are easier on the eyes than pure #000000
        darkBase: '#121212',
        darkSurface: '#1e1e1e',

        // Input fields
        inputBg: '#27272a',    // Zinc-800
        inputBorder: '#3f3f46', // Zinc-700
        inputText: '#e4e4e7',   // Zinc-200

        // Footer colors
        footerBg: '#18181b',    // Zinc-900 (a very dark gray)
        footerText: '#a1a1aa',  // Zinc-400

        // Brand color (deep red matching the logo UI)
        brandRed: '#b00b0b',
        brandRedHover: '#8a0a0a',
      },
      fontFamily: {
        // Modern sans-serif for body text, elegant serif for headings
        sans: ['Inter', 'Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
}
