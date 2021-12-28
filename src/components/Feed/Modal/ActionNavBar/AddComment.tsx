import { Flex, Button, Text, useToast } from '@chakra-ui/react'
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
import type { FirebaseError } from 'firebase/app'
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
      const error = err as FirebaseError

      handleError({ error })
    }
  }

  return (
    <>
      {userInfo.isLoggedIn ? (
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
            {...register('comment', {
              required: true,
              disabled: userInfo.isLoggedIn ? false : true,
            })}
          />

          <Button w='70px' type='submit' isLoading={isSubmitting}>
            <MdSend size={30} cursor='pointer' />
          </Button>
        </Flex>
      ) : (
        <Text as='strong' textAlign='center'>
          Faça login para comentar
        </Text>
      )}
    </>
  )
}

export { AddComment }
