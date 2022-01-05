import { useState } from 'react'
import {
  Button,
  Text,
  Flex,
  Box,
  useToast,
  useBreakpointValue,
} from '@chakra-ui/react'
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage'
import { useForm } from 'react-hook-form'
import { ref as databaseRef, update, push } from 'firebase/database'
import { useRouter } from 'next/router'
import Head from 'next/head'

// components
import { Input } from '../../components/form/inputs/RegularInput'
import { FileUploadInput } from '../../components/form/inputs/FileUploadInput'

// firebase services
import { db } from '../../services/firebase/client/database'
import { storage } from '../../services/firebase/client/storage'

// hooks
import { useUser } from '../../hooks/contexts/useUser'
import { useHandleError } from '../../hooks/useHandleError'

// layout
import { UserHeader } from '../../components/layout/UserHeader'

// form validation
import { postPhotoValidation } from '../../components/form/validations/postImage'

// types
import type { FirebaseError } from 'firebase/app'
import type { SubmitHandler } from 'react-hook-form'

type FormInputs = {
  title: string
  description: string
  image: FileList
}

function Post() {
  const [imageFileURL, setImageFileURL] = useState('')

  // hooks
  const toast = useToast()
  const router = useRouter()
  const { userInfo } = useUser()
  const { handleError } = useHandleError()
  const isWideScreen = useBreakpointValue({ sm: false, md: true, lg: true })
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>()

  const onFormSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const imageID = push(databaseRef(db, `images/${userInfo.uid}`)).key

      const uploadedImageLocationRef = storageRef(
        storage,
        `images/${userInfo.uid}/${imageID}`
      )

      // save image to storage
      const {
        metadata: { timeCreated },
      } = await uploadBytes(uploadedImageLocationRef, data.image[0])

      const imageURL = await getDownloadURL(uploadedImageLocationRef)

      // save image metadata to database
      const imageInfo = {
        id: imageID,
        author_username: userInfo.username,
        author_id: userInfo.uid,
        path: imageURL,
        title: data.title,
        description: data.description,
        created_at: timeCreated,
      }
      const updates = {
        [`images/${userInfo.uid}/${imageID}`]: imageInfo,
        [`latest_images/${imageID}`]: imageInfo,
        [`image_metrics/${imageID}/views`]: 0,
        [`image_metrics/${imageID}/likes`]: 0,
      }
      await update(databaseRef(db), updates)

      reset()
      setImageFileURL('')
      URL.revokeObjectURL(imageFileURL)

      toast({
        title: 'Foto enviada!',
        description: 'Sua foto foi postada com sucesso!',
        duration: 5000,
        isClosable: true,
        status: 'success',
        onCloseComplete: () => router.push('/account/myphotos'),
      })
    } catch (err) {
      const error = err as FirebaseError

      handleError({ error })
    }
  }

  if (userInfo.isAccountVerified === false) {
    return (
      <>
        <Head>
          <title>Dogs | Postar foto</title>
        </Head>

        <Box maxW='768px' mx='auto'>
          <Text>
            Você precisa verificar sua conta antes de começar a postar suas
            fotos.
          </Text>
        </Box>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Dogs | Postar foto</title>
      </Head>

      {isWideScreen ? (
        <Box
          maxW='768px'
          mx='auto'
          as='form'
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <Flex justify='center' columnGap={5}>
            <FileUploadInput
              label='Escolher foto'
              error={errors.image?.message}
              imageFileURL={imageFileURL}
              setImageFileURL={setImageFileURL}
              {...register('image', postPhotoValidation.image)}
            />

            <Flex w='100%' direction='column'>
              <Input
                label='Título'
                error={errors.title?.message}
                {...register('title', postPhotoValidation.title)}
              />

              <Input
                label='Descrição'
                error={errors.description?.message}
                as='textarea'
                h='70px'
                pt={3}
                {...register('description', postPhotoValidation.description)}
              />

              <Button
                mt={2}
                w={['100%', 32]}
                alignSelf='flex-end'
                isLoading={isSubmitting}
                loadingText='Postando...'
                type='submit'
              >
                Postar
              </Button>
            </Flex>
          </Flex>
        </Box>
      ) : (
        <Box
          maxW='768px'
          mx='auto'
          as='form'
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <Box>
            <Input
              label='Título'
              error={errors.title?.message}
              {...register('title', postPhotoValidation.title)}
            />

            <Input
              label='Descrição'
              error={errors.description?.message}
              as='textarea'
              h='70px'
              pt={3}
              {...register('description', postPhotoValidation.description)}
            />
          </Box>

          <Box>
            <FileUploadInput
              label='Escolher foto'
              error={errors.image?.message}
              imageFileURL={imageFileURL}
              setImageFileURL={setImageFileURL}
              {...register('image', postPhotoValidation.image)}
            />
          </Box>

          <Button
            w={['100%', 32]}
            mt={5}
            isLoading={isSubmitting}
            loadingText='Postando...'
            type='submit'
          >
            Postar
          </Button>
        </Box>
      )}
    </>
  )
}

Post.UserHeader = UserHeader

export default Post
