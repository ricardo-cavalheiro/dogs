import { useState, useEffect } from 'react'
import { Box, useToast } from '@chakra-ui/react'
import { applyActionCode } from 'firebase/auth'
import { captureException } from '@sentry/nextjs'

// firebase services
import { auth } from '../../services/firebase/auth'

// types
import type { GetServerSideProps } from 'next'

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

  useEffect(() => {
    applyActionCode(auth, oobCode)
      .then(() => {
        setIsEmailVerified(true)

        toast({
          title: 'Seu e-email foi confirmado.',
          description: 'Agora você pode postar suas fotos.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      })
      .catch((err) => {
        setIsEmailVerified(false)

        if (process.env.NODE_ENV === 'production') {
          captureException(err)
        } else {
          console.log({ err })
        }

        toast({
          title: 'E-mail não confirmado',
          description: 'Por favor, tente novamente em alguns instantes.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      })
  }, [])

  return (
    <Box>
      {isEmailVerified === true
        ? 'Tudo certo!'
        : isEmailVerified === false
        ? 'Não conseguimos verificar seu e-mail.'
        : 'Verificando seu e-mail...'}
    </Box>
  )
}

export { getServerSideProps }

export default VerifyEmail
