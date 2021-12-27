import { Box, Text, Button, useToast } from '@chakra-ui/react'
import { captureException } from '@sentry/nextjs'
import { sendEmailVerification } from 'firebase/auth'

// hooks
import { useHandleError } from '../hooks/useHandleError'

// firebase services
import { auth } from '../services/firebase/auth'

// types
import type { AuthError } from 'firebase/auth'

function VerifyEmailMessage() {
  // hooks
  const toast = useToast()
  const { handleError } = useHandleError()

  async function resendEmail() {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser, {
          url: 'https://dogs-ricardo-passos.vercel.app/',
        })
      }

      toast({
        title: 'E-mail reenviado!',
        description: 'Verifique sua caixa de e-mail.',
        isClosable: true,
        status: 'success',
      })
    } catch (err) {
      const error = err as AuthError

      switch (error.code) {
        case 'auth/too-many-requests':
          handleError(error.code)

          break
        default:
          handleError('default')

          process.env.NODE_ENV === 'production'
            ? captureException(error)
            : console.log({ error })

          break
      }
    }
  }

  return (
    <Box px={2} pt={2}>
      <Text as='strong' d='block' textAlign='center' fontSize='15px'>
        Você precisa confirmar sua conta
      </Text>
      <Button onClick={resendEmail}>Reenviar e-mail de confirmação</Button>
    </Box>
  )
}

export { VerifyEmailMessage }
