import { mode } from '@chakra-ui/theme-tools'

// types
import type { StyleFunctionProps } from '@chakra-ui/theme-tools'

const Heading = {
  baseStyle: {
    position: 'relative',
    _before: {
      content: '""',
      display: 'block',
      width: '24px',
      height: '24px',
      bg: 'light.300',
      bottom: '5px',
      position: 'absolute',
      borderRadius: 'base',
      zIndex: 'hide',
    },
  },
  sizes: {
    lg: {
      fontSize: '48px',
      lineHeight: 'none',
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
        backgroundColor: 'light.150',
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
