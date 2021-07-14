module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "primary": "var(--primary-color)"
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
