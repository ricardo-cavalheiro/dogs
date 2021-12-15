import { useState, useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from 'react-icons/md'
import { ref, update, increment, onValue, off } from 'firebase/database'

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
  const { userInfo } = useUser()
  const toast = useToast()

  useEffect(() => {
    let likedImageRef: DatabaseReference

    try {
      likedImageRef = ref(
        db,
        `liked_images/${imageInfo.id}/${userInfo.username}`
      )

      onValue(likedImageRef, (snapshot) => {
        if (snapshot.exists()) {
          setIsLiked(true)
        }
      })
    } catch (err) {
      console.log(
        'houve um erro ao tentar verificar se a imagem ja estava curtida',
        { err }
      )
    }

    return () => off(likedImageRef)
  }, [])

  async function handlePhotoLike(isLiked: boolean) {
    try {
      if (isLiked === true) {
        const updates = {
          [`images/${imageInfo.author_username}/${imageInfo.id}/likes`]:
            increment(1),
          [`liked_images/${imageInfo.id}/${userInfo.username}`]: true,
        }

        await update(ref(db), updates)

        setIsLiked(true)
      } else {
        const updates = {
          [`images/${imageInfo.author_username}/${imageInfo.id}/likes`]:
            increment(-1),
          [`liked_images/${imageInfo.id}/${userInfo.username}`]: null,
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
          color='#333'
          cursor='pointer'
          onClick={() => handlePhotoLike(true)}
          onKeyDown={({ key }) => key === 'Enter' && handlePhotoLike(true)}
        />
      )}
    </>
  )
}

export { LikePhoto }
