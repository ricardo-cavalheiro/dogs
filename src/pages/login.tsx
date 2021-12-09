import { Flex, Box, Heading, Text, Button } from '@chakra-ui/react'
import Link from 'next/link'

// compoenents
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
