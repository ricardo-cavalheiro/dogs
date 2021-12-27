import { useState, useEffect } from 'react'
import { Box, Flex, Link, Text } from '@chakra-ui/react'
import { ref, onValue, off } from 'firebase/database'
import { captureException } from '@sentry/nextjs'
import NextLink from 'next/link'

// components
import { LikeComment } from './LikeComment'

// hooks
import { useUser } from '../../../../hooks/contexts/useUser'
import { useHandleError } from '../../../../hooks/useHandleError'

// firebase
import { db } from '../../../../services/firebase/database'

// types
import type { AuthError } from 'firebase/auth'
import type { Comment as CommentType } from '../../../../typings/userInfo'

type CommentProps = {
  comment: CommentType
  imageId: string
}

function Comment({ comment, imageId }: CommentProps) {
  // states
  const [isLiked, setIsLiked] = useState<boolean | null>(null)
  const [commentTotalLikes, setCommentTotalLikes] = useState(comment.likes)

  // hooks
  const { userInfo } = useUser()
  const { handleError } = useHandleError()

  // checks if the comment was already liked by the user
  useEffect(() => {
    const likedCommentRef = ref(
      db,
      `/liked_comments/${imageId}/${userInfo.uid}/${comment.id}`
    )

    onValue(
      likedCommentRef,
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

    return () => off(likedCommentRef)
  }, [])

  // updates the total of likes
  useEffect(() => {
    const authorCommentRef = ref(
      db,
      `/comment_metrics/${imageId}/${comment.id}/likes`
    )

    onValue(
      authorCommentRef,
      (snapshot) => snapshot.exists() && setCommentTotalLikes(snapshot.val()),
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

    return () => off(authorCommentRef)
  }, [])

  return (
    <Flex as='li' align='center' justify='space-between' gridGap={3}>
      <Box>
        <NextLink href={`/account/${comment.author_username}`} passHref>
          <Link fontWeight='bold'>{comment.author_username}</Link>
        </NextLink>

        <Text as='p'>{comment.comment}</Text>

        <Flex>
          <Text as='span' fontWeight='bold' opacity={0.8} fontSize={13}>
            {commentTotalLikes} likes
          </Text>
        </Flex>
      </Box>

      <LikeComment
        imageId={imageId}
        commentId={comment.id}
        isLiked={isLiked}
        setIsLiked={setIsLiked}
      />
    </Flex>
  )
}

export { Comment }
