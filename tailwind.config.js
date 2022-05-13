module.exports = {
  content: ['./**/*.html',],
  safelist: [/data-theme$/,],
  theme: {
    screens:{
      'sm': '640px',
      'sm-land': {'raw': '(orientation: landscape) and (min-width:640px) and (max-width:820px)'}, // iphone x is 812
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: require('daisyui/colors'),
    },
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
      styled: true,
      themes: true,
      rtl: false,
    },
}
