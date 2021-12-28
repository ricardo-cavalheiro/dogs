import { Heading, Box, Button, Text, useToast } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
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
import { useUser } from '../../../hooks/contexts/useUser'
import { useHandleError } from '../../../hooks/useHandleError'

// firebase services
import { auth } from '../../../services/firebase/auth'

// yup validation
import { signupValidation } from '../../form/validations/signup'

// types
import type { FirebaseError } from 'firebase/app'
import type { SubmitHandler } from 'react-hook-form'

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
  const { handleError } = useHandleError()
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
      const {
        user: { uid, emailVerified },
      } = await createUserWithEmailAndPassword(auth, email, password)

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: username })

        await sendEmailVerification(auth.currentUser, {
          url: 'https://dogs-ricardo-passos.vercel.app/',
        })
      }

      setUserInfo({
        uid,
        email,
        username,
        isAccountVerified: emailVerified,
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
      const error = err as FirebaseError

      handleError({ error })
    }
  }

  return (
    <Box as='form' onSubmit={handleSubmit(onFormSubmit)}>
      <Box as='fieldset'>
        <Heading as='legend'>Criar conta</Heading>

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
