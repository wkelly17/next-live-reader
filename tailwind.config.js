/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        'color-text': withOpacity('--color-text'),
        'color-base': withOpacity('--color-base'),
        'color-gray': withOpacity('--color-gray'),
        'color-black': withOpacity('--color-black'),
        'color-primary': withOpacity('--color-primary'),
      },
      colors: {
        'color-text': withOpacity('--color-text'),
        'color-base': withOpacity('--color-base'),
        'color-gray': withOpacity('--color-gray'),
        'color-black': withOpacity('--color-black'),
        'color-primary': withOpacity('--color-primary'),
      },
      spacing: {
        ...generateCommonSmallPixels(),
      },
      margin: { ...generateCommonSmallPixels() },
      fontFamily: {
        sans: ['"Atkinson Hyperlegible"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

function generateCommonSmallPixels() {
  let pxWidths = {};
  for (let i = 0; i < 32; i += 2) {
    let key = `${i}px`;
    pxWidths[key] = i;
  }
  return pxWidths;
}

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue) {
      return `hsla(var(${variableName}), ${opacityValue})`;
    }
    return `hsl(var(${variableName}))`;
  };
}
