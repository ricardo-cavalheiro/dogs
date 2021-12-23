import { Box, useToast } from '@chakra-ui/react'
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from 'react-icons/md'
import { captureException } from '@sentry/nextjs'
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

function LikeComment({ imageId, commentId, isLiked, setIsLiked }: Props) {
  // hooks
  const toast = useToast()
  const { userInfo } = useUser()

  async function handleCommentLike(isLiked: boolean) {
    try {
      if (isLiked === true) {
        const updates = {
          [`/comment_metrics/${commentId}/likes`]: increment(1),
          [`/liked_comments/${imageId}/${userInfo.uid}/${commentId}`]: true,
        }

        await update(ref(db), updates)

        setIsLiked(true)
      } else {
        const updates = {
          [`/comment_metrics/${commentId}/likes`]: increment(-1),
          [`/liked_comments/${imageId}/${userInfo.uid}/${commentId}`]: null,
        }

        await update(ref(db), updates)

        setIsLiked(false)
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'production') {
        captureException(err)
      } else {
        console.log({ err })
      }

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
          tabIndex={0}
          color='#fb1'
          cursor='pointer'
          onClick={() => handleCommentLike(false)}
          onKeyDown={({ key }) => key === 'Enter' && handleCommentLike(false)}
        />
      ) : (
        <MdOutlineFavoriteBorder
          tabIndex={0}
          cursor='pointer'
          onClick={() => handleCommentLike(true)}
          onKeyDown={({ key }) => key === 'Enter' && handleCommentLike(true)}
        />
      )}
    </Box>
  )
}

export { LikeComment }
