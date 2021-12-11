import { Heading, Box, Button, Text, useToast } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useRouter } from 'next/router'
import Link from 'next/link'

// components
import { Input } from '../../form/inputs/RegularInput'
import { PasswordInput } from '../../form/inputs/PasswordInput'

// hooks
import { useUser } from '../../../hooks/useUser'

// firebase config
import { auth } from '../../../services/firebase/auth'

// yup validation
import { signupValidation } from './yupSchema'

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
  const { push } = useRouter()
  const { setUserInfo } = useUser()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({ resolver: yupResolver(signupValidation) })

  const onFormSubmit: SubmitHandler<FormInputs> = async (
    { email, password, username },
    event
  ) => {
    event?.preventDefault()

    try {
      await createUserWithEmailAndPassword(auth, email, password)

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: username })
      }

      setUserInfo((prevUserInfo) => ({ ...prevUserInfo, email, username }))

      toast({
        title: 'Sua conta foi criada!',
        description: `${username}, seja bem vindo(a)! Você será redirecionado para sua conta em alguns instantes.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        onCloseComplete: () => push(`/account/${username}`),
      })
    } catch (err) {
      const error = err as AuthError

      const mapErrorCodeToMessageError = {
        'auth/email-already-in-use':
          'E-mail já cadastrado. Caso acredite ser um erro, entre em contato conosco.',
        default:
          'Esse erro foi inesperado. Já estamos trabalhando para resolvê-lo.',
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
    <Box as='form'>
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
          onClick={handleSubmit(onFormSubmit)}
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
