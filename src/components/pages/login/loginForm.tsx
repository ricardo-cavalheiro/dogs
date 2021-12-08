import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Heading, Button, Link, useToast } from '@chakra-ui/react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { useRouter } from 'next/router'
import NextLink from 'next/link'

// components
import { Input } from '../../form/inputs/RegularInput'
import { PasswordInput } from '../../form/inputs/PasswordInput'

// hooks
import { useUser } from '../../../hooks/useUser'

// firebase
import { auth } from '../../../services/firebase/auth'

// yup validation
import { loginValidation } from './yupSchema'

// types
import type { SubmitHandler } from 'react-hook-form'
import type { AuthError } from 'firebase/auth'

type FormInputs = {
  email: string
  password: string
}

function LoginForm() {
  // hooks
  const toast = useToast()
  const router = useRouter()
  const { setUserInfo } = useUser()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormInputs>({ resolver: yupResolver(loginValidation) })

  const onFormSubmit: SubmitHandler<FormInputs> = async (
    { email, password },
    event
  ) => {
    event?.preventDefault()

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)

      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        email,
        username: user.displayName as string,
      }))

      router.push('/account')
    } catch (err) {
      const error = err as AuthError

      const mapFirebaseErrorCodeToErrorMessage = {
        'auth/wrong-password': 'Verifique o e-mail e/ou senha inserido.',
        'auth/user-not-found': 'Verifique o e-mail e/ou senha inserido.',
        default:
          'Esse erro foi inesperado. Já estamos trabalhando para resolvê-lo.',
      }

      type SignatureIndex = keyof typeof mapFirebaseErrorCodeToErrorMessage

      const customErrorToast = (errorCode: SignatureIndex) => {
        return toast({
          title: 'Não foi possível fazer o login.',
          description: mapFirebaseErrorCodeToErrorMessage[errorCode],
          duration: 5000,
          isClosable: true,
          status: errorCode !== 'default' ? 'warning' : 'error',
        })
      }

      switch (error.code) {
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          customErrorToast(error.code)
          return
        default:
          customErrorToast('default')
          return
      }
    }
  }

  useEffect(() => {
    const isSignUpToastActive = toast.isActive('signup-toast')

    if (isSignUpToastActive) toast.close('signup-toast')
  }, [toast])

  return (
    <Box as='form'>
      <Box as='fieldset'>
        <Heading as='legend' color='light.800'>
          Entrar
        </Heading>

        <Input
          label='E-mail'
          error={errors.email?.message}
          {...register('email')}
        />
        <PasswordInput
          label='Senha'
          error={errors.password?.message}
          {...register('password')}
        />

        <Button mt={5} type='submit' onClick={handleSubmit(onFormSubmit)}>
          Entrar
        </Button>
      </Box>

      <NextLink href='/account/recovery' passHref>
        <Link
          mt={5}
          d='inline-block'
          color='light.900'
          position='relative'
          _hover={{ textDecoration: 'none' }}
          _after={{
            content: '""',
            display: 'inline-block',
            height: '2px',
            width: '100%',
            backgroundColor: 'currentColor',
            position: 'absolute',
            bottom: '0px',
            left: '0px',
          }}
        >
          Perdeu a senha?
        </Link>
      </NextLink>
    </Box>
  )
}

export { LoginForm }
