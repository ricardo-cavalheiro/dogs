import {
  Modal as CModal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Flex,
  Link,
  Text,
  Heading,
  Button,
  Divider,
  useToast,
} from '@chakra-ui/react'
import { MdOutlineVisibility, MdSend } from 'react-icons/md'
import {
  push,
  update,
  ref,
  onValue,
  off,
  increment,
} from 'firebase/database'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import NextImage from 'next/image'
import NextLink from 'next/link'

// components
import { Input } from '../../../form/inputs/RegularInput'
import { CommentsSection } from './CommentsSection'

// hooks
import { useUser } from '../../../../hooks/useUser'

// firebase
import { db } from '../../../../services/firebase/database'

// types
import type { SubmitHandler } from 'react-hook-form'
import type { ImageInfo, Comment } from '../../../../typings/userInfo'

type FormInputs = {
  comment: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
  imageInfo: ImageInfo
}

function Modal({ isOpen, onClose, imageInfo }: Props) {
  // states
  const [imageComments, setImageComments] = useState<Comment[]>([])
  const [imageViews, setImageViews] = useState(imageInfo.views)

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
      const imageCommentsRef = ref(db, `image_comments/${imageInfo.id}`)
      const newCommentRef = push(imageCommentsRef)

      update(newCommentRef, {
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

  // listens for new comments
  useEffect(() => {
    const imageCommentsRef = ref(db, `image_comments/${imageInfo.id}`)

    onValue(imageCommentsRef, (snapshot) => {
      if (snapshot.exists()) {
        setImageComments(Object.values(snapshot.val()))
      } else {
        setImageComments([])
      }
    })

    return () => {
      off(imageCommentsRef)
    }
  }, [])

  // increments image views when modal is open
  useEffect(() => {
    const imageRef = ref(db, `images/${userInfo.username}/${imageInfo.id}`)

    if (isOpen) {
      update(imageRef, {
        views: increment(1),
      })

      onValue(imageRef, (snapshot) => {
        if (snapshot.exists()) {
          setImageViews(snapshot.val().views)
        }
      })
    }

    return () => {
      off(imageRef)
    }
  }, [isOpen])

  return (
    <CModal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Box position='relative'>
            <NextImage
              src={imageInfo.path}
              alt={imageInfo.description}
              layout='responsive'
              height='200px'
              width='200px'
              priority={true}
            />
          </Box>

          <Box px={3} py={2}>
            <Flex justify='space-between' mt={5} mb={2} opacity={0.5}>
              <Box>
                <NextLink
                  href={`/account/${imageInfo.author_username}`}
                  passHref
                >
                  <Link>@{imageInfo.author_username}</Link>
                </NextLink>
              </Box>

              <Flex align='center' gridGap={1}>
                <MdOutlineVisibility size={20} />

                <Text as='span'>{imageViews}</Text>
              </Flex>
            </Flex>

            <Divider borderColor='#a8a8a8' />

            <Box mt={5} mb={2}>
              <Heading fontSize={40}>{imageInfo.title}</Heading>

              <Text as='p' mt={5}>
                {imageInfo.description}
              </Text>
            </Box>

            <Divider borderColor='#a8a8a8' />

            <Flex
              as='form'
              align='flex-end'
              gridGap={2}
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

            <CommentsSection comments={imageComments} imageId={imageInfo.id} />
          </Box>
        </ModalBody>
      </ModalContent>
    </CModal>
  )
}

export { Modal }
