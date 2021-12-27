import { Box } from '@chakra-ui/react'
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from 'react-icons/md'
import { captureException } from '@sentry/nextjs'
import { ref, update, increment } from 'firebase/database'

// hooks
import { useUser } from '../../../../hooks/contexts/useUser'
import { useHandleError } from '../../../../hooks/useHandleError'

// firebase services
import { db } from '../../../../services/firebase/database'

// types
import type { Dispatch, SetStateAction } from 'react'
import type { AuthError } from 'firebase/auth'

type Props = {
  imageId: string
  commentId: string
  isLiked: boolean | null
  setIsLiked: Dispatch<SetStateAction<boolean | null>>
}

function LikeComment({ imageId, commentId, isLiked, setIsLiked }: Props) {
  // hooks
  const { userInfo } = useUser()
  const { handleError } = useHandleError()

  async function handleCommentLike(isLiked: boolean) {
    try {
      if (isLiked === true) {
        const updates = {
          [`/comment_metrics/${imageId}/${commentId}/likes`]: increment(1),
          [`/liked_comments/${imageId}/${userInfo.uid}/${commentId}`]: true,
        }

        await update(ref(db), updates)

        setIsLiked(true)
      } else {
        const updates = {
          [`/comment_metrics/${imageId}/${commentId}/likes`]: increment(-1),
          [`/liked_comments/${imageId}/${userInfo.uid}/${commentId}`]: null,
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
