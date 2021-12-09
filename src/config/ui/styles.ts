import { mode } from '@chakra-ui/theme-tools'

// types
import type { GlobalStyleProps } from '@chakra-ui/theme-tools'

const fonts = {
  heading: 'Spectral',
  body: 'Helvetica',
}

const colors = {
  light: {
    100: '#EEE', // gray color
    150: '#DDD',
    200: '#FEA', // bright yellow
    300: '#FB1', // primary color
    400: '#F31', // text error color
    500: '#764701', // amarelo sobre tom, usar no texto do botao
    800: '#333333', // primary text color
    900: '#666666', // secondary text color
  },
}

const textStyles = {}

const global = {
  global: (props: GlobalStyleProps) => ({
    'a, h1, h2, label, input, p, span': {
      color: mode('light.800', 'red.200')(props),
    },
    svg: {
      width: 'min-content',
      flexBasis: 'min-content',
    },
    '#__next': {
      d: 'grid',
      gridTemplateRows:
        '64px minmax(calc(100vh - 164px), calc(100% - 164px)) 100px',
    },
  }),
}

export { global, colors, fonts, textStyles }
