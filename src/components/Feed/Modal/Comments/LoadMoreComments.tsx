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

// firebase services
import { db } from '../../../../services/firebase/database'

// types
import type { Comment } from '../../../../typings/userInfo'
import type { Query } from 'firebase/database'
import type { Dispatch, SetStateAction } from 'react'

type Props = {
  imageID: string
  imageComments: Comment[]
  setImageComments: Dispatch<SetStateAction<Comment[]>>
}

function LoadMoreComments({ imageID, imageComments, setImageComments }: Props) {
  const [isLastPage, setIsLastPage] = useState(false)

  function loadMoreComments() {
    if (isLastPage) return

    let imageCommentsRef: Query

    try {
      const lastCommentID = imageComments.at(-1)?.id as string

      imageCommentsRef = query(
        ref(db, `image_comments/${imageID}`),
        orderByKey(),
        limitToLast(4),
        endBefore(lastCommentID)
      )

      onValue(imageCommentsRef, (snapshot) => {
        if (snapshot.exists()) {
          const newComments = Object.values<Comment>(snapshot.val()).reverse()

          if (newComments.length < 4) setIsLastPage(true)

          setImageComments((prevComments) => [...prevComments, ...newComments])
        } else {
          setIsLastPage(true)
        }
      })
    } catch (err) {
      if (process.env.NODE_ENV === 'production') {
        captureException(err)
      } else {
        console.log({ err })
      }

      setImageComments([])
    }

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
