import {
  ChakraProvider as Provider,
  extendTheme,
  cookieStorageManager,
  localStorageManager,
} from '@chakra-ui/react'

// theme
import { global, colors, fonts, textStyles } from './styles'
import { components } from './components'

// types
import type { ReactNode } from 'react'
import type { GetServerSideProps } from 'next'

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors,
  fonts,
  styles: global,
  textStyles,
  components,
})

type Props = {
  cookies: string | undefined
  children: ReactNode
}

function ChakraProvider({ cookies, children }: Props) {
  const colorModeManager =
    typeof cookies === 'string'
      ? cookieStorageManager(cookies)
      : localStorageManager

  return (
    <Provider theme={theme} resetCSS colorModeManager={colorModeManager}>
      {children}
    </Provider>
  )
}

const getServerSideProps: GetServerSideProps = async ({ req }) => {
  return {
    props: {
      cookies: req.headers.cookie ?? '',
    },
  }
}

export { ChakraProvider, theme, getServerSideProps }
