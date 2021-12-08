// types
import type { StyleFunctionProps } from '@chakra-ui/theme-tools'

const Link = {
  variants: {
    none: (props: StyleFunctionProps) => ({
      _hover: {
        textDecoration: 'none',
      },
    }),
  },
}

export { Link }
