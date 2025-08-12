/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {


      backgroundImage: {

        "golf-wall": "url(/images/golf-wall.jpg)"
      },
      backgroundColor: {
        glare: "rgba(255, 255, 255, 0.15)",
        'black-trans': "rgba(0, 0, 0, 0.5)",
      },


    },
  },
  plugins: [],
}
