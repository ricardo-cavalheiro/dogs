import {
  Flex,
  Box,
  Link,
  Text,
  Avatar,
  Skeleton,
  SkeletonCircle,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { AiOutlineUser } from 'react-icons/ai'
import NextLink from 'next/link'

// components
import { DogsIcon } from '../Icons'
import { VerifyEmailMessage } from '../VerifyEmailMessage'

// hooks
import { useUser } from '../../hooks/contexts/useUser'

type UserAccount = {
  href: string
  label: string
  username?: string
}

function UserAccount({ href, label, username }: UserAccount) {
  return (
    <NextLink href={href} passHref>
      <Link
        d='flex'
        alignItems='center'
        justifyContent='flex-end'
        gridGap={2.5}
        _hover={{
          textDecoration: 'none'
        }}
      >
        <Text as='span'>{label}</Text>
        <Avatar
          name={username}
          bg='light.300'
          icon={<AiOutlineUser color='#333' />}
          
        />
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

      <Flex
        align='center'
        justify='space-between'
        w='100%'
        maxW='768px'
        p={[5, null, '20px 0px']}
      >
        <NextLink href='/' passHref>
          <Link>
            <DogsIcon />
          </Link>
        </NextLink>

        <Box>
          {fetchingUserInfoFirebase ? (
            <Flex align='center' columnGap={2}>
              <Skeleton w='100px' h='20px' />
              <SkeletonCircle size='48px' />
            </Flex>
          ) : userInfo.isLoggedIn ? (
            <UserAccount
              href={`/account/${userInfo.username}`}
              label={userInfo.username}
              username={userInfo.username}
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
