import { Flex } from '@chakra-ui/react'

// components
import { LoginForm } from '../components/pages/login/LoginForm'
import { SignUpCallToAction } from '../components/pages/login/SignUpCallToAction'

function Login() {
  return (
    <Flex as='main' direction='column' p={5}>
      <LoginForm />

      <SignUpCallToAction />
    </Flex>
  )
}

export default Login
