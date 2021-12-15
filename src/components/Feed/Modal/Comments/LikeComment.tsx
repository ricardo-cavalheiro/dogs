import { Box, useToast } from '@chakra-ui/react'
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from 'react-icons/md'
import { ref, update, increment } from 'firebase/database'

// hooks
import { useUser } from '../../../../hooks/contexts/useUser'

// firebase services
import { db } from '../../../../services/firebase/database'

// types
import type { Dispatch, SetStateAction } from 'react'

type Props = {
  imageId: string
  commentId: string
  isLiked: boolean | null
  setIsLiked: Dispatch<SetStateAction<boolean | null>>
}

function LikeComment({
  imageId,
  commentId,
  isLiked,
  setIsLiked,
}: Props) {
  // hooks
  const toast = useToast()
  const { userInfo } = useUser()

  async function handleCommentLike(isLiked: boolean) {
    try {
      if (isLiked === true) {
        const updates = {
          [`/image_comments/${imageId}/${commentId}/likes`]: increment(1),
          [`/liked_comments/${imageId}/${userInfo.username}/${commentId}`]:
            true,
        }

        await update(ref(db), updates)

        setIsLiked(true)
      } else {
        const updates = {
          [`/image_comments/${imageId}/${commentId}/likes`]: increment(-1),
          [`/liked_comments/${imageId}/${userInfo.username}/${commentId}`]:
            null,
        }

        await update(ref(db), updates)

        setIsLiked(false)
      }
    } catch (err) {
      console.log('erro ao atualizar o comentario curtido', { err })

      toast({
        status: 'error',
        duration: 5000,
        isClosable: true,
        title: 'Houve um erro ao curtir o comentário.',
        description: 'Por favor, tente novamente em alguns instantes.',
      })
    }
  }

  return (
    <Box>
      {isLiked ? (
        <MdOutlineFavorite
          onClick={() => handleCommentLike(false)}
          cursor='pointer'
          color='#fb1'
        />
      ) : (
        <MdOutlineFavoriteBorder
          onClick={() => handleCommentLike(true)}
          cursor='pointer'
        />
      )}
    </Box>
  )
}

export { LikeComment }