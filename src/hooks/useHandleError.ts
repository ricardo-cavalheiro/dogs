import { useMemo } from 'react'
import { useToast } from '@chakra-ui/react'
import { captureException } from '@sentry/nextjs'

// types
import type { FirebaseError } from 'firebase/app'

type ErrorCodes =
  | 'auth/email-already-in-use'
  | 'auth/too-many-requests'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'PERMISSION_DENIED'
  | 'unknown'

type Error = {
  [Key in ErrorCodes]: { [Key in 'title' | 'description']: string }
}

function useHandleError() {
  // hooks
  const toast = useToast()

  const mapErrorCodeToMessageError = useMemo(
    (): Error => ({
      'auth/email-already-in-use': {
        title: 'E-mail já cadastrado.',
        description: 'Caso acredite ser um erro, entre em contato conosco.',
      },
      PERMISSION_DENIED: {
        title: 'Você precisa estar logado para continuar.',
        description: '',
      },
      'auth/user-not-found': {
        title: 'Usuário não encontrado.',
        description: 'Verifique o e-mail e/ou senha inserido.',
      },
      'auth/wrong-password': {
        title: 'Usuário não encontrado.',
        description: 'Verifique o e-mail e/ou senha inserido.',
      },
      'auth/too-many-requests': {
        title: 'Owa, vai com calma.',
        description: 'Por favor, tente novamente em alguns instantes.',
      },
      unknown: {
        title: 'Estamos com alguns problemas.',
        description: 'Mas já estamos trabalhando para resolvê-los.',
      },
    }),
    []
  )

  type HandleError = {
    error: FirebaseError
    silent?: boolean
  }

  const handleError = ({ error, silent = false }: HandleError) => {
    const errorCode = error.code as ErrorCodes

    if (mapErrorCodeToMessageError[errorCode]) {
      silent
        ? console.log({ error })
        : toast({
            title: mapErrorCodeToMessageError[errorCode].title,
            description: mapErrorCodeToMessageError[errorCode].description,
            status: 'warning',
            duration: 5000,
            isClosable: true,
          })
    } else {
      silent
        ? process.env.NODE_ENV === 'production'
          ? captureException(error)
          : console.log({ error })
        : toast({
            title: mapErrorCodeToMessageError['unknown'].title,
            description: mapErrorCodeToMessageError['unknown'].description,
            status: 'error',
            duration: 5000,
            isClosable: true,
          })

      process.env.NODE_ENV === 'production'
        ? captureException(error)
        : console.log({ error })
    }
  }

  return { handleError }
}

export { useHandleError }
