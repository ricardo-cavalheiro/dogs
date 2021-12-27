import { useState, useEffect } from 'react'
import { useToast, useColorMode } from '@chakra-ui/react'
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from 'react-icons/md'
import { ref, update, increment, onValue, off } from 'firebase/database'
import { captureException } from '@sentry/nextjs'

// hooks
import { useUser } from '../../../../hooks/contexts/useUser'
import { useHandleError } from '../../../../hooks/useHandleError'

// firebase services
import { db } from '../../../../services/firebase/database'

// types
import type { AuthError } from 'firebase/auth'
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
  const { handleError } = useHandleError()

  // verfies if the image is already liked by the user
  useEffect(() => {
    const likedImageRef = ref(
      db,
      `liked_images/${imageInfo.id}/${userInfo.uid}`
    )

    onValue(
      likedImageRef,
      (snapshot) => snapshot.exists() && setIsLiked(true),
      (err) => {
        const error = err as AuthError

        switch (error.code) {
          default:
            handleError('default')

            process.env.NODE_ENV === 'production'
              ? captureException(error)
              : console.log({ error })

            break
        }
      }
    )

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
      const error = err as AuthError

      switch (error.code) {
        default:
          handleError('default')

          process.env.NODE_ENV === 'production'
            ? captureException(error)
            : console.log({ error })

          break
      }
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
