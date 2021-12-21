import { mode } from '@chakra-ui/theme-tools'

// types
import type { StyleFunctionProps } from '@chakra-ui/theme-tools'

const Heading = {
  baseStyle: (props: StyleFunctionProps) => ({
    position: 'relative',
    _before: {
      content: '""',
      display: 'block',
      width: '24px',
      height: '24px',
      bgColor: 'light.300',
      bottom: '5px',
      position: 'absolute',
      borderRadius: 'base',
      zIndex: -1,
    },
    zIndex: 1,
  }),
  sizes: {
    lg: {
      fontSize: '48px',
      lineHeight: 'none',
    },
    md: {
      fontSize: '32px',
    },
  },
  variants: {
    outline: (props: StyleFunctionProps) => ({
      fontSize: '32px',
      _before: {
        content: '""',
        display: 'block',
        position: 'absolute',
        bottom: '-5px',
        bgColor: mode('light.150', 'dark.400')(props),
        height: 2,
        width: 12,
        borderRadius: 'base',
      },
    }),
  },
  defaultProps: {
    size: 'lg',
  },
}

export { Heading }
