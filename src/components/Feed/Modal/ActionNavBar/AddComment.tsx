import { useState } from 'react'
import { Collapse, Flex, Button, useToast } from '@chakra-ui/react'
import { MdModeComment, MdOutlineModeComment, MdSend } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import { push, update, ref } from 'firebase/database'

// components
import { Input } from '../../../form/inputs/RegularInput'

// firebase services
import { db } from '../../../../services/firebase/database'

// hooks
import { useUser } from '../../../../hooks/contexts/useUser'
import { Portal } from '../../../../hooks/usePortal'

// types
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
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>()

  const onCommentSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const imageCommentsRef = ref(db, `image_comments/${imageID}`)
      const newCommentRef = push(imageCommentsRef)

      await update(newCommentRef, {
        id: newCommentRef.key,
        comment: data.comment,
        author_username: userInfo.username,
        likes: 0,
      })

      toast({
        status: 'success',
        duration: 5000,
        title: 'Comentário adicionado',
        isClosable: true,
      })

      reset()
    } catch (err) {
      console.log({ err })

      toast({
        status: 'error',
        duration: 5000,
        title: 'Houve um erro ao adicionar seu comentário.',
        description: 'Estamos trabalhando para resolver esse problema.',
        isClosable: true,
      })
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
          color='#333'
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
