/** @type {import('tailwindcss').Config} */

const gridSafeList = []
for (let i = 1; i <= 12; i++ ) {
  gridSafeList.push(`grid-cols-${i}`);
  gridSafeList.push(`grid-rows-${i}`);
}

export default {
  safelist: gridSafeList,
  content: [
    "./*.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
