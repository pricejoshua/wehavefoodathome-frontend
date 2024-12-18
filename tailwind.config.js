/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      'default-house-image': 'url(../assets/images/house.jpg)',
    },
    // https://coolors.co/6d8455-172815-d9c2a5-52528c-372554 
    colors: { 'reseda_green': { DEFAULT: '#6d8455', 100: '#161b11', 200: '#2c3622', 300: '#425033', 400: '#586b44', 500: '#6d8455', 600: '#8ca471', 700: '#a8bb95', 800: '#c5d2b8', 900: '#e2e8dc' }, 'dark_green': { DEFAULT: '#172815', 100: '#050804', 200: '#091008', 300: '#0e180d', 400: '#122011', 500: '#172815', 600: '#396334', 700: '#5b9e53', 800: '#8fc189', 900: '#c7e0c4' }, 'dun': { DEFAULT: '#d9c2a5', 100: '#362817', 200: '#6c502d', 300: '#a27744', 400: '#c39d6f', 500: '#d9c2a5', 600: '#e1ceb7', 700: '#e8dac9', 800: '#f0e7db', 900: '#f7f3ed' }, 'ultra_violet': { DEFAULT: '#52528c', 100: '#11111c', 200: '#212139', 300: '#323255', 400: '#424271', 500: '#52528c', 600: '#6f6faa', 700: '#9393c0', 800: '#b7b7d5', 900: '#dbdbea' }, 'russian_violet': { DEFAULT: '#372554', 100: '#0b0711', 200: '#160f22', 300: '#211633', 400: '#2d1e44', 500: '#372554', 600: '#5b3d8b', 700: '#805db8', 800: '#aa93d0', 900: '#d5c9e7' } }
  },
  plugins: [],
}

