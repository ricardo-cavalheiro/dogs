import { Flex } from '@chakra-ui/react'

// components
import { SignUpForm } from '../components/pages/signup/signupForm'

function SignUp() {
  return (
    <Flex as='main' direction='column' p={5}>
      <SignUpForm />
    </Flex>
  )
}

export default SignUp
