import { Box, useToast } from '@chakra-ui/react'
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from 'react-icons/md'
import {
  ref,
  update,
  increment,
  onValue,
  push,
  set,
  remove,
} from 'firebase/database'

// hooks
import { useUser } from '../../../../hooks/contexts/useUser'

// firebase services
import { db } from '../../../../services/firebase/database'

// types
import type { Dispatch, SetStateAction } from 'react'

type LikedComments = { [key: string]: string }

type Props = {
  imageId: string
  commentId: string
  commentTotalLikes: number
  isLiked: boolean | null
  setIsLiked: Dispatch<SetStateAction<boolean | null>>
  setCommentTotalLikes: Dispatch<SetStateAction<number>>
  likedComments: LikedComments
}

function LikeComment({
  imageId,
  commentId,
  isLiked,
  setIsLiked,
  likedComments,
  commentTotalLikes,
  setCommentTotalLikes,
}: Props) {
  // hooks
  const toast = useToast()
  const { userInfo } = useUser()

  async function handleCommentLike(isLiked: boolean) {
    try {
      const authorCommentRef = ref(
        db,
        `/image_comments/${imageId}/${commentId}`
      )
      const userLikedCommentsRef = ref(
        db,
        `/liked_comments/${imageId}/${userInfo.username}/${commentId}`
      )

      if (isLiked === true) {
        await update(authorCommentRef, {
          likes: increment(1),
        })

        await set(userLikedCommentsRef, commentId)

        setIsLiked(true)
      } else {
        if (commentTotalLikes < 1) return

        await update(authorCommentRef, {
          likes: increment(-1),
        })

        await remove(
          ref(
            db,
            `/liked_comments/${imageId}/${userInfo.username}/${likedComments[commentId]}`
          )
        )

        setIsLiked(false)
      }

      // updates the total of likes
      onValue(authorCommentRef, (snapshot) => {
        if (snapshot.exists()) {
          setCommentTotalLikes(snapshot.val().likes)
        }
      })
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
