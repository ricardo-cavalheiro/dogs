import { Flex } from '@chakra-ui/react'
import { parseCookies } from 'nookies'
import { getAuth } from 'firebase-admin/auth'

// components
import { SignUpForm } from '../components/pages/signup/signupForm'

// firebase services
import { adminApp } from '../services/firebase/admin'

// types
import type { GetServerSideProps } from 'next'

const getServerSideProps: GetServerSideProps = async (context) => {
  const userIDToken = parseCookies(context)['@dogs:token']

  try {
    await getAuth(adminApp).verifyIdToken(userIDToken)

    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  } catch (err) {
    console.log({ err })

    return {
      props: {},
    }
  }
}

function SignUp() {
  return (
    <Flex as='main' direction='column' p={5}>
      <SignUpForm />
    </Flex>
  )
}

export { getServerSideProps }

export default SignUp
