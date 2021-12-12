import { Box, Text, Button, useToast } from '@chakra-ui/react'
import { sendEmailVerification } from 'firebase/auth'

// firebase services
import { auth } from '../services/firebase/auth'

// types
import type { AuthError } from 'firebase/auth'

function EmailConfirmationMessage() {
  // hooks
  const toast = useToast()

  async function resendEmail() {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser, {
          url: 'http://localhost:3000',
        })
      }

      toast({
        title: 'E-mail reenviado!',
        description: 'Verifique sua caixa de e-mail.',
        isClosable: true,
        status: 'success',
      })
    } catch (err) {
      console.log('erro ao reenviar o e-mail', { err })
      const error = err as AuthError

      const mapErrorCodeToMessageError = {
        'auth/too-many-requests': {
          title: 'Owa, vai com calma.',
          description:
            'Tente solicitar o reenvio do e-mail daqui a uns minutos.',
        },
        default: {
          title: '',
          description: 'Por favor, tente novamente em alguns instantes.',
        },
      }

      type IndexSignature = keyof typeof mapErrorCodeToMessageError

      const customErrorToast = (errorCode: IndexSignature) => {
        return toast({
          title:
            mapErrorCodeToMessageError[errorCode].title ||
            'Não conseguimos reenviar o e-mail de confirmação.',
          description: mapErrorCodeToMessageError[errorCode].description,
          status: errorCode !== 'default' ? 'warning' : 'error',
          duration: 5000,
          isClosable: true,
          id: 'signup-toast',
        })
      }

      switch (error.code) {
        case 'auth/too-many-requests':
          customErrorToast(error.code)
          return
        default:
          // TODO: send unexpected errors to Sentry
          customErrorToast('default')
          return
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

export { EmailConfirmationMessage }
