import { useMemo, useCallback } from 'react'
import { useToast } from '@chakra-ui/react'

type ErrorCodes =
  | 'auth/email-already-in-use'
  | 'auth/permission-denied'
  | 'auth/too-many-requests'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'default'

type Error = {
  [Prop in ErrorCodes]: { title: string; description: string }
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
      'auth/permission-denied': {
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
      default: {
        title: 'Estamos com alguns problemas.',
        description: 'Mas já estamos trabalhando para resolvê-los.',
      },
    }),
    []
  )

  const toastInfo = useCallback((errorCode: ErrorCodes) => {
    return toast({
      title: mapErrorCodeToMessageError[errorCode].title,
      description: mapErrorCodeToMessageError[errorCode].description,
      status: errorCode !== 'default' ? 'warning' : 'error',
      duration: 5000,
      isClosable: true,
    })
  }, [])

  const handleError = (errorCode: ErrorCodes) => toastInfo(errorCode)

  return { handleError }
}

export { useHandleError }
