// components
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Loading } from '../components/Loading'

// hooks
import { UserContextProvider } from '../hooks/contexts/useUser'

// chakra
import { ChakraProvider } from '../config/ui'

// types
import type { AppProps } from 'next/app'
import type { ComponentType } from 'react'

type ComponentWithPageLayout = AppProps & {
  Component: AppProps['Component'] & {
    UserHeader?: ComponentType
  }
}

function MyApp({ Component, pageProps }: ComponentWithPageLayout) {
  return (
    <ChakraProvider cookies={pageProps.cookies}>
      <UserContextProvider>
        <Loading />

        <Header />

        {Component.UserHeader ? (
          <Component.UserHeader>
            <Component {...pageProps} />
          </Component.UserHeader>
        ) : (
          <Component {...pageProps} />
        )}

        <Footer />
      </UserContextProvider>
    </ChakraProvider>
  )
}

export default MyApp
