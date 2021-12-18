import type { StyleFunctionProps } from '@chakra-ui/theme-tools'

const Button = {
  variants: {
    solid: (props: StyleFunctionProps) => ({
      bg: 'light.300',
      color: 'light.500',
      fontWeight: 'thin',
      w: 'auto',
      _active: {
        bgColor: 'light.300',
        boxShadow: `0 0 0 3px ${props.theme.colors.light['200']}`,
      },
      _hover: {
        bg: 'light.300',
        boxShadow: `0 0 0 3px ${props.theme.colors.light['200']}, 0 0 0 4px ${props.theme.colors.light['300']}`,
        _disabled: {
          bg: 'light.300',
          cursor: 'wait',
        },
      },
      _disabled: {
        opacity: '1',
      },
    }),
    fileUpload: (props: StyleFunctionProps) => ({
      bg: 'light.100',
      w: '100%',
    }),
    cancel: (props: StyleFunctionProps) => ({
      bg: 'gray.100',
      color: 'light.800',
      _hover: {
        bg: 'gray.300',
        color: 'gray.800',
        boxShadow: `0 0 0 3px ${props.theme.colors.gray['50']}, 0 0 0 4px ${props.theme.colors.gray['400']}`,
      },
    }),
  },
}

export { Button }
