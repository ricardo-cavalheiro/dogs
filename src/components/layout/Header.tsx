import { Flex, Box, Link, Text, Spinner, Center } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'

// components
import { DogsIcon, UserIcon } from '../Icons'
import { VerifyEmailMessage } from '../VerifyEmailMessage'

// hooks
import { useUser } from '../../hooks/contexts/useUser'

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
  const { userInfo, fetchingUserInfoFirebase } = useUser()
  const router = useRouter()

  // basically, the email confirmation message will only show
  // in the public feed and user account pages
  // it avoids showing the message when the user has just created an account
  const showEmailConfirmationMessage =
    (router.asPath.startsWith('/account') || router.asPath.endsWith('/')) &&
    userInfo.isLoggedIn &&
    userInfo.isAccountVerified === false

  return (
    <Flex
      as='header'
      align='center'
      justify='space-between'
      direction='column'
      top='0'
      zIndex={4}
      position='sticky'
      backdropFilter='blur(6px)'
      boxShadow='0 1px 1px rgb(0 0 0 / 10%)'
    >
      {showEmailConfirmationMessage && <VerifyEmailMessage />}

      <Flex align='center' justify='space-between' w='100%' p={5}>
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
          ) : userInfo.isLoggedIn ? (
            <UserAccount
              href={`/account/${userInfo.username}`}
              label={userInfo.username}
            />
          ) : (
            <UserAccount href='/login' label='Entrar / Criar conta' />
          )}
        </Box>
      </Flex>
    </Flex>
  )
}

export { Header }
