import { useEffect } from 'react'
import { captureException } from '@sentry/nextjs'
import { useForm } from 'react-hook-form'
import { Box, Heading, Button, useToast } from '@chakra-ui/react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'

// components
import { Input } from '../../form/inputs/RegularInput'
import { PasswordInput } from '../../form/inputs/PasswordInput'
import { PasswordRecovery } from './PasswordRecovery'

// hooks
import { useHandleError } from '../../../hooks/useHandleError'

// firebase services
import { auth } from '../../../services/firebase/auth'

// yup validation
import { loginValidation } from '../../form/validations/login'

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
  const { handleError } = useHandleError()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({ resolver: yupResolver(loginValidation) })

  const onFormSubmit: SubmitHandler<FormInputs> = async ({
    email,
    password,
  }) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)

      router.push(`/account/${user.displayName}`)
    } catch (err) {
      const error = err as AuthError

      switch (error.code) {
        case 'auth/wrong-password':
        case 'auth/user-not-found':
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

  // this closes the toast if the user is coming from signup page
  useEffect(() => {
    const isSignUpToastActive = toast.isActive('signup-toast')

    if (isSignUpToastActive) toast.close('signup-toast')
  }, [toast])

  return (
    <Box as='form' onSubmit={handleSubmit(onFormSubmit)}>
      <Box as='fieldset'>
        <Heading as='legend'>Entrar</Heading>

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

        <Button
          mt={5}
          type='submit'
          isLoading={isSubmitting}
          loadingText='Entrando...'
        >
          Entrar
        </Button>
      </Box>

      <PasswordRecovery />
    </Box>
  )
}

export { LoginForm }
