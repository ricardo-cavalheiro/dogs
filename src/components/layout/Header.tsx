import { Flex, Box, Link, Text, Spinner, Center } from '@chakra-ui/react'
import NextLink from 'next/link'

// components
import { DogsIcon, UserIcon } from '../icons'

// hooks
import { useUser } from '../../hooks/useUser'

type UserAccount = {
  href: string
  label: string
}

function UserAccount({ href, label }: UserAccount) {
  return (
    <NextLink href={href} passHref>
      <Link
        d='flex'
        alignItems='center'
        justifyContent='flex-end'
        gridGap={2.5}
      >
        <Text as='span'>{label}</Text>
        <UserIcon />
      </Link>
    </NextLink>
  )
}

function Header() {
  // hooks
  const { userInfo } = useUser()
  const { fetchingUserInfoFirebase } = useUser()

  return (
    <Flex
      p={5}
      gridGap={5}
      align='center'
      justify='space-between'
      boxShadow='0 1px 1px rgb(0 0 0 / 10%)'
      top='0'
      position='sticky'
      backdropFilter='blur(6px)'
      as='header'
      zIndex={4}
    >
      <NextLink href='/' passHref>
        <Link>
          <DogsIcon />
        </Link>
      </NextLink>
      <Box>
        {fetchingUserInfoFirebase ? (
          <Center>
            <Spinner />
          </Center>
        ) : userInfo.username ? (
          <UserAccount
            href={`/account/${userInfo.username}`}
            label={userInfo.username}
          />
        ) : (
          <UserAccount href='/login' label='Entrar / Criar conta' />
        )}
      </Box>
    </Flex>
  )
}

export { Header }
