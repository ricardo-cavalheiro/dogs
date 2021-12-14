import { useState, useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from 'react-icons/md'
import {
  ref,
  update,
  increment,
  set,
  onValue,
  remove,
  off,
} from 'firebase/database'

// hooks
import { useUser } from '../../../../hooks/contexts/useUser'

// firebase services
import { db } from '../../../../services/firebase/database'

// types
import type { DatabaseReference } from 'firebase/database'
import type { ImageInfo } from '../../../../typings/userInfo'

type IsLiked = {
  isLiked: boolean | null
}

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
        `liked_images/${userInfo.username}/${imageInfo.id}`
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

    return () => {
      off(likedImageRef)
    }
  }, [])

  async function handlePhotoLike(isLiked: boolean) {
    try {
      const imageRef = ref(
        db,
        `images/${imageInfo.author_username}/${imageInfo.id}`
      )
      const likedImageRef = ref(
        db,
        `liked_images/${userInfo.username}/${imageInfo.id}`
      )

      if (isLiked === true) {
        await update(imageRef, {
          likes: increment(1),
        })
        await set(likedImageRef, imageInfo.id)

        setIsLiked(true)
      } else {
        await update(imageRef, {
          likes: increment(-1),
        })
        await remove(likedImageRef)

        setIsLiked(false)
      }

      off(imageRef)
      off(likedImageRef)
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
          color='#fb1'
          cursor='pointer'
          onClick={() => handlePhotoLike(false)}
        />
      ) : (
        <MdOutlineFavoriteBorder
          size={30}
          color='#333'
          cursor='pointer'
          onClick={() => handlePhotoLike(true)}
        />
      )}
    </>
  )
}

export { LikePhoto }
