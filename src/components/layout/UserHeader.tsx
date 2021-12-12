import { Box } from '@chakra-ui/react'

// components
import { Header } from '../pages/account/Header'

// types
import type { ReactElement, ReactNode } from 'react'

// TODO: find the appropriate type for `page` variable
type CustomReactElementType = ReactElement & { children: ReactNode }

function UserHeader(page: CustomReactElementType) {
  return (
    <Box as='main' p={5}>
      <Header />
      {page?.children}
    </Box>
  )
}

export { UserHeader }
