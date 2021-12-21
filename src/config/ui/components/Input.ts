import { mode } from '@chakra-ui/theme-tools'

// types
import type { StyleFunctionProps } from '@chakra-ui/theme-tools'

const Input = {
  baseStyle: (props: StyleFunctionProps) => ({
    color: mode('light.800', 'dark.800')(props),
  }),
  variants: {
    filled: (props: StyleFunctionProps) => ({
      field: {
        bg: mode('light.100', 'dark.800')(props),
        borderRadius: 'md',
        _hover: {
          bg: mode('light.50', 'dark.50')(props),
          color: mode('light.800', 'dark.800')(props),
          borderColor: 'light.300',
          borderWidth: '1px',
          boxShadow: `0 0 0 3px ${props.theme.colors.light['200']}`,
        },
        _focus: {
          bg: mode('light.50', 'dark.50')(props),
          color: mode('light.800', 'dark.800')(props),
          borderColor: 'light.300',
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
