import { mode } from '@chakra-ui/theme-tools'

// types
import type { StyleFunctionProps } from '@chakra-ui/theme-tools'

const Modal = {
  baseStyle: (props: StyleFunctionProps) => ({
    dialogContainer: {
      py: '20px',
      px: '40px',
    },
    dialog: {
      m: '0px',
      overflow: 'hidden',
      bg: mode('light.50', 'dark.900')(props),
    },
    header: {
      // these css rules are used in the Alert Dialog component
      d: 'flex',
      alignContent: 'center',
      justifyContent: 'space-between',
      ['& > button']: {
        position: 'initial',
      },
      bg: mode('light.50', 'dark.900')(props),
      borderBottom: `1px solid ${mode(
        props.theme.colors.light['150'],
        props.theme.colors.dark['800']
      )(props)}`,
    },
    body: {
      p: '0px',
      bg: mode('light.50', 'dark.900')(props),
    },
    footer: {
      bg: mode('light.50', 'dark.900')(props),
    },
  }),
}

export { Modal }
