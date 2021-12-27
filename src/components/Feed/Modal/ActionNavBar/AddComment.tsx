import { Flex, Button, useToast } from '@chakra-ui/react'
import { captureException } from '@sentry/nextjs'
import { useForm } from 'react-hook-form'
import { push, set, ref } from 'firebase/database'
import { MdSend } from 'react-icons/md'

// components
import { Input } from '../../../form/inputs/RegularInput'

// firebase services
import { db } from '../../../../services/firebase/database'

// hooks
import { useHandleError } from '../../../../hooks/useHandleError'
import { useUser } from '../../../../hooks/contexts/useUser'

// types
import type { AuthError } from 'firebase/auth'
import type { SubmitHandler } from 'react-hook-form'

type FormInputs = {
  comment: string
}

type Props = {
  imageID: string
}

function AddComment({ imageID }: Props) {
  // hooks
  const toast = useToast()
  const { userInfo } = useUser()
  const { handleError } = useHandleError()
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>()

  const onCommentSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const newCommentID = push(ref(db, `image_comments/${imageID}`)).key

      await set(ref(db, `image_comments/${imageID}/${newCommentID}`), {
        id: newCommentID,
        comment: data.comment,
        author_username: userInfo.username,
      })

      toast({
        status: 'success',
        duration: 5000,
        title: 'Comentário adicionado',
        isClosable: true,
      })

      reset()
    } catch (err) {
      const error = err as AuthError

      process.env.NODE_ENV === 'production'
        ? captureException(error)
        : console.log({ error })

      error.code === 'PERMISSION_DENIED'
        ? handleError('auth/permission-denied')
        : handleError('default')
    }
  }

  return (
    <>
      <Flex
        as='form'
        h='min-content'
        gridGap={2}
        align='flex-end'
        justify='space-between'
        onSubmit={handleSubmit(onCommentSubmit)}
      >
        <Input
          label='Comentar'
          w='100%'
          minH='40px'
          error={errors.comment?.message}
          {...register('comment', { required: true })}
        />

        <Button type='submit' isLoading={isSubmitting} w='70px'>
          <MdSend size={30} cursor='pointer' />
        </Button>
      </Flex>
    </>
  )
}

export { AddComment }
