import { mode } from '@chakra-ui/theme-tools'

// types
import type { StyleFunctionProps } from '@chakra-ui/theme-tools'

const Menu = {
  baseStyle: (props: StyleFunctionProps) => ({
    list: {
      bg: mode('light.50', 'dark.800')(props),
    },
  }),
}

export { Menu }
