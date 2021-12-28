import { mode } from '@chakra-ui/theme-tools'

// types
import type { StyleFunctionProps } from '@chakra-ui/theme-tools'

const Menu = {
  baseStyle: (props: StyleFunctionProps) => ({
    list: {
      py: 1,
      px: 2,
      bg: mode('light.50', 'dark.800')(props),
      boxShadow: mode('0 1px 2px rgb(0 0 0 / 20%)', '0 1px 2px #101010')(props),
      border: 'none',
      ['& > button']: {
        borderBottom: '0px',
      },
      ['& a:not(:first-of-type) button, & > button']: {
        mt: 1,
      },
    },
    item: {
      borderBottomWidth: '1px',
      borderBottomColor: mode('#eee', '#a8a8a8')(props),
      position: 'relative',
      _focus: {
        bg: 'none',
        ['span > svg']: {
          transition: '200ms',
          fill: 'light.300',
        },
      },
    },
  }),
}

export { Menu }
