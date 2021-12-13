import { Heading, Box, Button, Text, useToast } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth'
import Link from 'next/link'

// components
import { Input } from '../../form/inputs/RegularInput'
import { PasswordInput } from '../../form/inputs/PasswordInput'

// hooks
import { useUser } from '../../../hooks/useUser'

// firebase services
import { auth } from '../../../services/firebase/auth'

// yup validation
import { signupValidation } from '../../form/yupSchemaValidations/signup'

// types
import type { SubmitHandler } from 'react-hook-form'
import type { AuthError } from 'firebase/auth'

type FormInputs = {
  username: string
  email: string
  password: string
  confirmPassword: string
}

function SignUpForm() {
  // hooks
  const toast = useToast()
  const { setUserInfo } = useUser()
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({ resolver: yupResolver(signupValidation) })

  const onFormSubmit: SubmitHandler<FormInputs> = async ({
    email,
    password,
    username,
  }) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: username })
        await sendEmailVerification(auth.currentUser, {
          url: 'http://localhost:3000/',
        })
      }

      setUserInfo({
        email,
        username,
        isAccountVerified: false,
        isLoggedIn: true,
      })

      reset()

      toast({
        title: 'Sua conta foi criada!',
        description:
          'Agora você precisa acessar sua caixa de e-mail e confirmar sua conta.',
        status: 'success',
        duration: 5000,
      })
    } catch (err) {
      const error = err as AuthError

      const mapErrorCodeToMessageError = {
        'auth/email-already-in-use':
          'E-mail já cadastrado. Caso acredite ser um erro, entre em contato conosco.',
        default:
          'Estamos com alguns problemas. Mas já estamos trabalhando para resolvê-los.',
      }

      type IndexSignature = keyof typeof mapErrorCodeToMessageError

      const customErrorToast = (errorCode: IndexSignature) => {
        return toast({
          title: 'Houve um erro 😓',
          description: mapErrorCodeToMessageError[errorCode],
          status: errorCode !== 'default' ? 'warning' : 'error',
          duration: 5000,
          isClosable: true,
          id: 'signup-toast',
        })
      }

      switch (error.code) {
        case 'auth/email-already-in-use':
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
    <Box as='form' onSubmit={handleSubmit(onFormSubmit)}>
      <Box as='fieldset'>
        <Heading as='legend' color='light.800'>
          Criar conta
        </Heading>

        <Input
          label='Usuário'
          error={errors.username?.message}
          {...register('username')}
        />
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
        <Input
          label='Confirmar senha'
          type='password'
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button
          mt={5}
          minW={32}
          type='submit'
          isLoading={isSubmitting}
          loadingText='Cadastrando...'
        >
          Cadastrar
        </Button>
      </Box>

      <Box mt={10}>
        <Heading as='h2' variant='outline'>
          Acessar conta
        </Heading>

        <Text my={5}>Já possui conta? Faça login.</Text>

        <Link href='/login' passHref>
          <Button as='a'>Entrar</Button>
        </Link>
      </Box>
    </Box>
  )
}

export { SignUpForm }
