// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#f3c300',
        'text-primary': '#222222',
        'text-secondary': '#555555',
      },
      fontFamily: {
        title: ['Raleway', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}