import { useState, useEffect } from 'react'
import { Box, Flex, Link, Text } from '@chakra-ui/react'
import { ref, onValue, off } from 'firebase/database'
import { captureException } from '@sentry/nextjs'
import NextLink from 'next/link'

// components
import { LikeComment } from './LikeComment'

// hooks
import { useUser } from '../../../../hooks/contexts/useUser'

// firebase
import { db } from '../../../../services/firebase/database'

// types
import type { DatabaseReference } from 'firebase/database'
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

  // checks if the comment was already liked by the user
  useEffect(() => {
    let likedCommentRef: DatabaseReference

    try {
      likedCommentRef = ref(
        db,
        `/liked_comments/${imageId}/${userInfo.uid}/${comment.id}`
      )

      onValue(
        likedCommentRef,
        (snapshot) => snapshot.exists() && setIsLiked(true)
      )
    } catch (err) {
      if (process.env.NODE_ENV === 'production') {
        captureException(err)
      } else {
        console.log({ err })
      }
    }

    return () => off(likedCommentRef)
  }, [])

  // updates the total of likes
  useEffect(() => {
    const authorCommentRef = ref(
      db,
      `/image_comments/${imageId}/${comment.id}/likes`
    )

    onValue(
      authorCommentRef,
      (snapshot) => snapshot.exists() && setCommentTotalLikes(snapshot.val())
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
