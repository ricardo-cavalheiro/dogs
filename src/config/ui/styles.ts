import { mode } from '@chakra-ui/theme-tools'

// types
import type { GlobalStyleProps } from '@chakra-ui/theme-tools'

const fonts = {
  heading: 'Spectral',
  body: 'Helvetica',
}

const colors = {
  light: {
    50: '#FFF',
    100: '#EEE', // gray color
    150: '#DDD',
    200: '#FEA', // bright yellow
    300: '#FB1', // primary color
    400: '#F31', // text error color
    500: '#764701', // amarelo sobre tom, usar no texto do botao
    800: '#333333', // primary text color
    900: '#666666', // secondary text color
  },
  dark: {
    50: '#FFF',
    400: '#FB1',
    800: '#333333',
    900: '#101010',
  },
}

const textStyles = {}

const global = {
  global: (props: GlobalStyleProps) => ({
    'h1, h2, label, input, p, span, legend': {
      color: mode('light.800', 'dark.50')(props),
    },
    '::-webkit-scrollbar': {
      width: '10px',
    },
    '::-webkit-scrollbar-track': {
      background: props.theme.colors.light['150'],
      borderRadius: '10px',
    },
    '::-webkit-scrollbar-thumb': {
      background: props.theme.colors.light['300'],
      borderRadius: '10px',
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: props.theme.colors.light['800'],
    },
    body: {
      bg: mode('light.50', 'dark.900')(props),
    },
    '#__next': {
      h: '100vh',
      d: 'grid',
      gridTemplateRows: 'auto 1fr auto',
    },
    '.feed:nth-of-type(5n + 2)': {
      gridColumn: '2 / 4',
      gridRow: 'span 2',
    },
  }),
}

export { global, colors, fonts, textStyles }
