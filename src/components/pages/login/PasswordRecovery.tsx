import { Link } from '@chakra-ui/react'
import NextLink from 'next/link'

function PasswordRecovery() {
  return (
    <NextLink href='/account/recovery' passHref>
      <Link
        mt={5}
        d='inline-block'
        color='light.900'
        position='relative'
        _hover={{ textDecoration: 'none' }}
        _after={{
          content: '""',
          display: 'inline-block',
          height: '2px',
          width: '100%',
          backgroundColor: 'currentColor',
          position: 'absolute',
          bottom: '0px',
          left: '0px',
        }}
      >
        Perdeu a senha?
      </Link>
    </NextLink>
  )
}

export { PasswordRecovery }
