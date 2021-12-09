import { useState, useEffect } from 'react'
import { Flex, useToast } from '@chakra-ui/react'
import {
  ref,
  remove,
  update,
  set,
  onValue,
  increment,
  off,
} from 'firebase/database'
import {
  MdOutlineFavorite,
  MdOutlineFavoriteBorder,
  MdModeComment,
  MdOutlineModeComment,
  MdDeleteOutline,
} from 'react-icons/md'

// hooks
import { useUser } from '../../../hooks/useUser'

// firebase
import { db } from '../../../services/firebase/database'

// types
import type { Dispatch, SetStateAction } from 'react'
import type { DatabaseReference } from 'firebase/database'
import type { ImageInfo } from '../../../typings/userInfo'

type IsLiked = {
  isLiked: boolean | null
  didUserLiked: boolean | null
}

type Props = {
  imageInfo: ImageInfo
  isCommentInputShown: boolean
  setIsCommentInputShown: Dispatch<SetStateAction<boolean>>
}

function FooterMenu({
  imageInfo,
  isCommentInputShown,
  setIsCommentInputShown,
}: Props) {
  // states
  const [isLiked, setIsLiked] = useState<IsLiked>({
    isLiked: null,
    didUserLiked: null,
  })
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
          setIsLiked({ isLiked: true, didUserLiked: false })
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

  async function handlePhotoLike(isLiked: boolean, didUserLiked: boolean) {
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

        setIsLiked({ isLiked: true, didUserLiked: true })
      } else {
        await update(imageRef, {
          likes: increment(-1),
        })
        await remove(likedImageRef)

        setIsLiked({ isLiked: false, didUserLiked: true })
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

  async function deletePhoto() {
    try {
      const userAccountImageRef = ref(
        db,
        `images/${imageInfo.author_username}/${imageInfo.id}`
      )
      const publicFeedImageRef = ref(db, `latest_images/${imageInfo.id}`)

      await remove(userAccountImageRef)
      await remove(publicFeedImageRef)

      off(userAccountImageRef)
      off(publicFeedImageRef)
    } catch (err) {
      console.log('houve um erro ao deletar a foto', { err })

      toast({
        status: 'error',
        duration: 5000,
        isClosable: true,
        title: 'Não foi possível deletar a foto.',
        description: 'Por favor, tente novamente em alguns instantes',
      })
    }
  }

  return (
    <Flex gridGap={2}>
      {isLiked.isLiked ? (
        <MdOutlineFavorite
          size={30}
          color='#fb1'
          cursor='pointer'
          onClick={() => handlePhotoLike(false, true)}
        />
      ) : (
        <MdOutlineFavoriteBorder
          size={30}
          color='#333'
          cursor='pointer'
          onClick={() => handlePhotoLike(true, true)}
        />
      )}

      {isCommentInputShown ? (
        <MdModeComment
          size={30}
          color='#fb1'
          cursor='pointer'
          onClick={() => setIsCommentInputShown(!isCommentInputShown)}
        />
      ) : (
        <MdOutlineModeComment
          size={30}
          color='#333'
          cursor='pointer'
          onClick={() => setIsCommentInputShown(!isCommentInputShown)}
        />
      )}

      {userInfo.username === imageInfo.author_username && (
        <MdDeleteOutline
          size={30}
          color='#333'
          cursor='pointer'
          onClick={deletePhoto}
        />
      )}
    </Flex>
  )
}

export { FooterMenu }
