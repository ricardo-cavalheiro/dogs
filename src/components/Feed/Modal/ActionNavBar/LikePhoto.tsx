import { useState, useEffect } from 'react'
import { useToast, useColorMode } from '@chakra-ui/react'
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from 'react-icons/md'
import { ref, update, increment, onValue, off } from 'firebase/database'
import { captureException } from '@sentry/nextjs'

// hooks
import { useUser } from '../../../../hooks/contexts/useUser'

// firebase services
import { db } from '../../../../services/firebase/database'

// types
import type { DatabaseReference } from 'firebase/database'
import type { ImageInfo } from '../../../../typings/userInfo'

type Props = {
  imageInfo: ImageInfo
}

function LikePhoto({ imageInfo }: Props) {
  // states
  const [isLiked, setIsLiked] = useState<boolean | null>(null)

  // hooks
  const toast = useToast()
  const { userInfo } = useUser()
  const { colorMode } = useColorMode()

  // verfies if the image is already liked by the user
  useEffect(() => {
    let likedImageRef: DatabaseReference

    try {
      likedImageRef = ref(db, `liked_images/${imageInfo.id}/${userInfo.uid}`)

      onValue(
        likedImageRef,
        (snapshot) => snapshot.exists() && setIsLiked(true)
      )
    } catch (err) {
      if (process.env.NODE_ENV === 'production') {
        captureException(err)
      } else {
        console.log({ err })
      }
    }

    return () => off(likedImageRef)
  }, [])

  async function handlePhotoLike(isLiked: boolean) {
    try {
      if (isLiked === true) {
        const updates = {
          [`image_metrics/${imageInfo.id}/likes`]: increment(1),
          [`liked_images/${imageInfo.id}/${userInfo.uid}`]: true,
        }

        await update(ref(db), updates)

        setIsLiked(true)
      } else {
        const updates = {
          [`image_metrics/${imageInfo.id}/likes`]: increment(-1),
          [`liked_images/${imageInfo.id}/${userInfo.uid}`]: null,
        }

        await update(ref(db), updates)

        setIsLiked(false)
      }
    } catch (err) {
      console.log('houve um erro ao tentar curtir a foto', { err })

      toast({
        title: 'Não foi possível curtir a foto.',
        description: 'Por favor, tente novamente em alguns instantes.',
        status: 'error',
        isClosable: true,
        duration: 5000,
      })
    }
  }

  return (
    <>
      {isLiked ? (
        <MdOutlineFavorite
          size={30}
          tabIndex={0}
          color='#fb1'
          cursor='pointer'
          onClick={() => handlePhotoLike(false)}
          onKeyDown={({ key }) => key === 'Enter' && handlePhotoLike(false)}
        />
      ) : (
        <MdOutlineFavoriteBorder
          size={30}
          tabIndex={0}
          color={`${colorMode === 'light' ? '#333' : '#fff'}`}
          cursor='pointer'
          onClick={() => handlePhotoLike(true)}
          onKeyDown={({ key }) => key === 'Enter' && handlePhotoLike(true)}
        />
      )}
    </>
  )
}

export { LikePhoto }
