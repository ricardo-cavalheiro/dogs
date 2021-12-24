import {
  Box,
  Button,
  Text,
  Flex,
  Heading,
  useToast,
  useBreakpointValue,
} from '@chakra-ui/react'
import { captureException } from '@sentry/nextjs'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { sendPasswordResetEmail } from 'firebase/auth'
import Head from 'next/head'

// components
import { Input } from '../../../components/form/inputs/RegularInput'

// firebase services
import { auth } from '../../../services/firebase/auth'

// form validation
import { emailValidation } from '../../../components/form/validations/recovery'

// types
import type { SubmitHandler } from 'react-hook-form'

type FormInputProps = {
  email: string
}

function Recovery() {
  // hooks
  const toast = useToast()
  const isWideScreen = useBreakpointValue({ sm: false, md: true })
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputProps>({ resolver: yupResolver(emailValidation) })

  const onFormSubmit: SubmitHandler<FormInputProps> = async (data) => {
    try {
      await sendPasswordResetEmail(auth, data.email, {
        url: 'https://dogs-ricardo-passos.vercel.app/login',
      })

      toast({
        title: 'E-mail enviado!',
        description: 'Verifique sua caixa de e-email e siga as intruções.',
        status: 'success',
        isClosable: true,
      })

      reset()
    } catch (err) {
      if (process.env.NODE_ENV === 'production') {
        captureException(err)
      } else {
        console.log({ err })
      }

      toast({
        title: 'Não conseguimos enviar o e-mail.',
        description: 'Por favor, tente novamente em alguns instantes.',
        status: 'error',
        isClosable: true,
      })
    }
  }

  return (
    <Box as='main' p={5} maxW='768px' mx='auto'>
      <Head>
        <title>Dogs | Alterar senha</title>
      </Head>
      
      <Heading>Alterar senha</Heading>

      {isWideScreen ? (
        <Flex columnGap={5}>
          <Box flexBasis='50%'>
            <Text mt={5}>
              Para mudar de senha, digite o e-mail associado à sua conta e
              clique em enviar. Você receberá um e-mail contendo as intruções
              para mudar sua senha.
            </Text>
          </Box>

          <Box as='form' onSubmit={handleSubmit(onFormSubmit)} flexBasis='50%'>
            <Input
              label='E-mail'
              error={errors.email?.message}
              {...register('email')}
            />

            <Button
              type='submit'
              isLoading={isSubmitting}
              loadingText='Enviando...'
              mt={4}
              w='100%'
            >
              Enviar
            </Button>
          </Box>
        </Flex>
      ) : (
        <>
          <Text mt={5}>
            Para mudar de senha, digite o e-mail associado à sua conta e clique
            em enviar. Você receberá um e-mail contendo as intruções para mudar
            sua senha.
          </Text>

          <Box as='form' onSubmit={handleSubmit(onFormSubmit)}>
            <Input
              label='E-mail'
              error={errors.email?.message}
              {...register('email')}
            />

            <Button
              type='submit'
              isLoading={isSubmitting}
              loadingText='Enviando...'
              mt={4}
              w='100%'
            >
              Enviar
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}

export default Recovery
