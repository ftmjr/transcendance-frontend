/** @type {import('tailwindcss').Config} */
/* eslint-disable no-undef */
module.exports = {
  content: ['src/**/*.vue', 'src/App.vue'],
  theme: {
    container: {
      center: true,
      padding: '2rem'
    },
    extend: {
      color: {
        primary: '#0C0F0A',
        secondary: '#FF206E',
        tertiary: '#FBFF12',
        accent: '#41EAD4'
      },
      backgroundColor: {
        primary: '#0C0F0A',
        secondary: '#FF206E',
        tertiary: '#FBFF12',
        accent: '#41EAD4'
      }
    }
  },
  plugins: []
}
