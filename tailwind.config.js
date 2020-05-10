module.exports = {
  theme: {    
    extend: {
      colors: {
        's-light-gray': '#f5f5f5',
        's-gray': '#ededed',
        's-dark-gray': '#313131',
        's-medium-gray': '#a1a1a1',
        's-red': '#dc0000'
      },
      boxShadow: {
        's-inner': 'inset 0px 0px 20.4px 3.6px rgba(0, 1, 5, 0.35)'
      },
      spacing:{
        '28': '7rem',
        '5/8': '45%',
        '3/8': '37.5%',
        '2/8': '25%',
        '1/8': '12.5%',
      },
    },
    screens: {
      'xs': '460px',
      // => @media (min-width: 460px) { ... }

      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }
    },
    inset: {
      '0': 0,
      auto: 'auto',
      '1/2': '50%',
      '1/3': '33.3%',
      '1/28': '28%',
      '1/4': '25%',
      '1/18': '18%',
    },
  },
  variants: {},
  plugins: [],
}
