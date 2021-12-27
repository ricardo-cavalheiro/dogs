import { useState } from 'react'
import {
  Collapse,
  Flex,
  Button,
  useToast,
  useColorMode,
} from '@chakra-ui/react'
import { captureException } from '@sentry/nextjs'
import { MdModeComment, MdOutlineModeComment, MdSend } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import { push, set, ref } from 'firebase/database'

// components
import { Input } from '../../../form/inputs/RegularInput'

// firebase services
import { db } from '../../../../services/firebase/database'

// hooks
import { Portal } from '../../../../hooks/usePortal'
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
  // states
  const [isCommentInputShown, setIsCommentInputShown] = useState(false)

  // hooks
  const toast = useToast()
  const { userInfo } = useUser()
  const { handleError } = useHandleError()
  const { colorMode } = useColorMode()
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
      {isCommentInputShown ? (
        <MdModeComment
          size={30}
          tabIndex={0}
          color='#fb1'
          cursor='pointer'
          onClick={() => setIsCommentInputShown(!isCommentInputShown)}
          onKeyDown={({ key }) =>
            key === 'Enter' && setIsCommentInputShown(!isCommentInputShown)
          }
        />
      ) : (
        <MdOutlineModeComment
          size={30}
          tabIndex={0}
          color={`${colorMode === 'light' ? '#333' : '#fff'}`}
          cursor='pointer'
          onClick={() => setIsCommentInputShown(!isCommentInputShown)}
          onKeyDown={({ key }) =>
            key === 'Enter' && setIsCommentInputShown(!isCommentInputShown)
          }
        />
      )}

      <Portal container='.comment-input-wrapper'>
        <Collapse in={isCommentInputShown}>
          <Flex
            as='form'
            gridGap={2}
            align='flex-end'
            justify='space-between'
            onSubmit={handleSubmit(onCommentSubmit)}
          >
            <Input
              label='Comentar'
              as='textarea'
              w='100%'
              h='60px'
              minH='40px'
              pt={1.5}
              error={errors.comment?.message}
              {...register('comment', { required: true })}
            />

            <Button type='submit' isLoading={isSubmitting} w='70px' mb='7px'>
              <MdSend size={30} cursor='pointer' />
            </Button>
          </Flex>
        </Collapse>
      </Portal>
    </>
  )
}

export { AddComment }
