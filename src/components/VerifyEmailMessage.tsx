import { Box, Text, Button, useToast } from '@chakra-ui/react'
import { sendEmailVerification } from 'firebase/auth'

// hooks
import { useHandleError } from '../hooks/useHandleError'

// firebase services
import { auth } from '../services/firebase/client/auth'

// types
import type { FirebaseError } from 'firebase/app'

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
      const error = err as FirebaseError

      handleError({ error })
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
