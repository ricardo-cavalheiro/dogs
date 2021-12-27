import { useState } from 'react'
import { Button, Text } from '@chakra-ui/react'
import { captureException } from '@sentry/nextjs'
import {
  query,
  ref,
  orderByKey,
  limitToLast,
  endBefore,
  onValue,
  off,
} from 'firebase/database'

// hooks
import { useHandleError } from '../../../../hooks/useHandleError'

// firebase services
import { db } from '../../../../services/firebase/database'

// types
import type { AuthError } from 'firebase/auth'
import type { Dispatch, SetStateAction } from 'react'
import type { Comment } from '../../../../typings/userInfo'

type Props = {
  imageID: string
  imageComments: Comment[]
  setImageComments: Dispatch<SetStateAction<Comment[]>>
}

function LoadMoreComments({ imageID, imageComments, setImageComments }: Props) {
  // states
  const [isLastPage, setIsLastPage] = useState(false)

  // hooks
  const { handleError } = useHandleError()

  function loadMoreComments() {
    if (isLastPage) return

    const lastCommentID = imageComments.at(-1)?.id as string

    const imageCommentsRef = query(
      ref(db, `image_comments/${imageID}`),
      orderByKey(),
      limitToLast(4),
      endBefore(lastCommentID)
    )

    onValue(
      imageCommentsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const newComments = Object.values<Comment>(snapshot.val()).reverse()

          if (newComments.length < 4) setIsLastPage(true)

          setImageComments((prevComments) => [...prevComments, ...newComments])
        } else {
          setIsLastPage(true)
        }
      },
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

    return () => off(imageCommentsRef)
  }

  if (imageComments.length === 0) return null

  return (
    <>
      {!isLastPage ? (
        <Button onClick={loadMoreComments} mb={5}>
          Mais comentários
        </Button>
      ) : (
        <Text as='strong' textAlign='center'>
          Sem mais comentários.
        </Text>
      )}
    </>
  )
}

export { LoadMoreComments }
