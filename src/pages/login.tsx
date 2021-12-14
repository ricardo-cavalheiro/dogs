import { parseCookies } from 'nookies'
import { Flex } from '@chakra-ui/react'
import { getAuth } from 'firebase-admin/auth'

// components
import { LoginForm } from '../components/pages/login/LoginForm'
import { SignUpCallToAction } from '../components/pages/login/SignUpCallToAction'

// firebase services
import { adminApp } from '../services/firebase/admin'

// types
import type { GetServerSideProps } from 'next'

const getServerSideProps: GetServerSideProps = async (context) => {
  const userIDToken = parseCookies(context)['@dogs:token']

  if (!userIDToken)
    return {
      props: {},
    }

  try {
    const auth = getAuth(adminApp)

    await auth.verifyIdToken(userIDToken)

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

function Login() {
  return (
    <Flex as='main' direction='column' p={5}>
      <LoginForm />

      <SignUpCallToAction />
    </Flex>
  )
}

export { getServerSideProps }

export default Login
