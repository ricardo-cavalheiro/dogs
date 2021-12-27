import { useState, useEffect } from 'react'
import { Box, Text, useToast } from '@chakra-ui/react'
import { applyActionCode } from 'firebase/auth'
import { captureException } from '@sentry/nextjs'
import Head from 'next/head'

// firebase services
import { auth } from '../../services/firebase/auth'

// hooks
import { useUser } from '../../hooks/contexts/useUser'
import { useHandleError } from '../../hooks/useHandleError'

// types
import type { GetServerSideProps } from 'next'
import type { AuthError } from 'firebase/auth'

const getServerSideProps: GetServerSideProps = async (context) => {
  const oobCode = context.query['oobCode']

  if (!oobCode) return { redirect: { destination: '/', permanent: false } }

  return {
    props: { oobCode },
  }
}

type Props = {
  oobCode: string
}

function VerifyEmail({ oobCode }: Props) {
  const [isEmailVerified, setIsEmailVerified] = useState<boolean | null>(null)

  // hooks
  const toast = useToast()
  const { setUserInfo } = useUser()
  const { handleError } = useHandleError()

  useEffect(() => {
    applyActionCode(auth, oobCode)
      .then(() => {
        setIsEmailVerified(true)

        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          isAccountVerified: true,
        }))

        toast({
          title: 'Seu e-email foi confirmado.',
          description: 'Agora você pode postar suas fotos.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      })
      .catch((err) => {
        const error = err as AuthError

        setIsEmailVerified(false)

        switch (error.code) {
          default:
            handleError('default')

            process.env.NODE_ENV === 'production'
              ? captureException(error)
              : console.log({ error })

            break
        }
      })
  }, [])

  return (
    <>
      <Head>
        <title>Dogs | Verificar e-mail</title>
      </Head>

      <Box maxW='768px' mx='auto'>
        {isEmailVerified === true ? (
          <Text as='strong'>Tudo certo!</Text>
        ) : isEmailVerified === false ? (
          <Text as='strong'>Não conseguimos verificar seu e-mail.</Text>
        ) : (
          <Text as='strong'>Verificando seu e-mail...</Text>
        )}
      </Box>
    </>
  )
}

export { getServerSideProps }

export default VerifyEmail
