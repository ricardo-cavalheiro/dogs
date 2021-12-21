import { mode } from '@chakra-ui/theme-tools'

// types
import type { StyleFunctionProps } from '@chakra-ui/theme-tools'

const Link = {
  baseStyle: (props: StyleFunctionProps) => ({
    color: mode('light.900', 'dark.50')(props)
  }),
  variants: {
    none: (props: StyleFunctionProps) => ({
      _hover: {
        textDecoration: 'none',
      },
    }),
  },
}

export { Link }
