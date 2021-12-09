import { useState } from 'react'
import { Box, Button, useToast } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { ref as databaseRef, set, push } from 'firebase/database'
import { useRouter } from 'next/router'

// components
import { Input } from '../../components/form/inputs/RegularInput'
import { FileUploadInput } from '../../components/form/inputs/FileUploadInput'

// firebase
import { storage } from '../../services/firebase/storage'
import { db } from '../../services/firebase/database'

// hooks
import { useUser } from '../../hooks/useUser'

// layout
import { UserHeader } from '../../components/layout/UserHeader'

// form validation
import { postPhotoValidation } from '../../components/pages/account/post/yupSchema'

// types
import type { SubmitHandler } from 'react-hook-form'

type FormInputs = {
  title: string
  description: string
  image: FileList
}

function Post() {
  const [imageFileURL, setImageFileURL] = useState('')

  // hooks
  const { userInfo } = useUser()
  const toast = useToast()
  const router = useRouter()
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    resolver: yupResolver(postPhotoValidation),
    mode: 'onChange',
  })

  const onFormSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const uploadedImageLocationRef = ref(
        storage,
        `images/${userInfo.username}/${data.image[0].name}`
      )

      // save image to storage
      const {
        metadata: { timeCreated },
      } = await uploadBytes(uploadedImageLocationRef, data.image[0])

      const imageURL = await getDownloadURL(uploadedImageLocationRef)

      // save image metadata to database
      // const imageListRef = collection(db, 'users')
      const imagesListRef = databaseRef(db, `images/${userInfo.username}`)
      const newImageRef = push(imagesListRef)
      const imageInfo = {
        id: newImageRef.key,
        author_username: userInfo.username,
        path: imageURL,
        title: data.title,
        description: data.description,
        created_at: timeCreated,
        views: 0,
        likes: 0,
      }
      await set(newImageRef, imageInfo)

      const latestImagesRef = databaseRef(
        db,
        `latest_images/${newImageRef.key}`
      )
      await set(latestImagesRef, imageInfo)

      reset()
      setImageFileURL('')
      URL.revokeObjectURL(imageFileURL)

      toast({
        title: 'Foto enviada!',
        description: 'Recebemos sua foto com sucesso!',
        duration: 5000,
        isClosable: true,
        status: 'success',
        onCloseComplete: () => router.push('/account'),
      })
    } catch (err) {
      console.log({ err })

      toast({
        title: 'Houve um erro ao enviar sua foto!',
        description: 'Mas já estamos trabalhando para resolver!',
        duration: 5000,
        isClosable: true,
        status: 'error',
      })
    }
  }

  return (
    <Box as='form' mt={10} onSubmit={handleSubmit(onFormSubmit)}>
      <Input
        label='Título'
        error={errors.title?.message}
        {...register('title')}
      />
      <Input
        label='Descrição'
        error={errors.description?.message}
        as='textarea'
        h='70px'
        pt={3}
        {...register('description')}
      />
      <FileUploadInput
        label='Escolher foto'
        error={errors.image?.message}
        imageFileURL={imageFileURL}
        setImageFileURL={setImageFileURL}
        {...register('image')}
      />

      <Button
        mt={5}
        isLoading={isSubmitting}
        loadingText='Postando...'
        type='submit'
      >
        Postar
      </Button>
    </Box>
  )
}

Post.UserHeader = UserHeader

export default Post
