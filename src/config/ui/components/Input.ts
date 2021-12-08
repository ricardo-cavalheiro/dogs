import { mode } from '@chakra-ui/theme-tools'

// types
import type { StyleFunctionProps } from '@chakra-ui/theme-tools'

const Input = {
  baseStyle: {},
  variants: {
    filled: (props: StyleFunctionProps) => ({
      field: {
        bg: mode('light.100', 'red.200')(props),
        borderRadius: 'md',
        _hover: {
          bg: mode('white', 'blue.200')(props),
          borderColor: mode('light.300', 'red.200')(props),
          borderWidth: '1px',
          boxShadow: `0 0 0 3px ${props.theme.colors.light['200']}`,
        },
        _focus: {
          bg: mode('white', 'blue.200')(props),
          borderColor: mode('light.300', 'red.200')(props),
          borderWidth: '1px',
          boxShadow: `0 0 0 3px ${props.theme.colors.light['200']}`,
        },
      },
    }),
  },
  defaultProps: {
    variant: 'filled',
  },
}

export { Input }
