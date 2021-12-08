import { Flex, Box, Heading, Text, Button } from '@chakra-ui/react'
import Link from 'next/link'

// compoenents
import { LoginForm } from '../components/pages/login/loginForm'

function Login() {
  return (
    <Flex as='main' direction='column' p={5}>
      <LoginForm />

      <Box mt={10}>
        <Heading as='h2' variant='outline'>
          Cadastre-se
        </Heading>

        <Text my={5}>Ainda não possui conta? Cadastre-se no site.</Text>

        <Link href='/signup' passHref>
          <Button as='a'>Cadastrar</Button>
        </Link>
      </Box>
    </Flex>
  )
}

export default Login
