import { useState, useEffect } from 'react'
import { Box, Flex, Link, Text, useToast } from '@chakra-ui/react'
import {
  ref,
  increment,
  update,
  push,
  remove,
  onValue,
  off,
} from 'firebase/database'
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

type LikedComments = { [key: string]: string }

function Comment({ comment, imageId }: CommentProps) {
  // states
  const [isLiked, setIsLiked] = useState<boolean | null>(null)
  const [commentTotalLikes, setCommentTotalLikes] = useState(comment.likes)
  const [likedComments, setLikedComments] = useState<LikedComments>({})
  // hooks
  const { userInfo } = useUser()

  // checks if the comment was already liked by the user
  useEffect(() => {
    let likedCommentRef: DatabaseReference

    try {
      likedCommentRef = ref(
        db,
        `/image_comments/${imageId}/${userInfo.username}/${
          likedComments[comment.id]
        }`
      )

      if (likedCommentRef.key !== 'undefined') {
        setIsLiked(true)
      }
    } catch (err) {
      console.log('erro ao ao atualizar os comentarios já curtidos', { err })
    }

    return () => off(likedCommentRef)
  }, [likedComments])

  // fetches the comments liked by the user so that
  // we can display the already liked comments
  useEffect(() => {
    const userLikedCommentsRef = ref(
      db,
      `/liked_comments/${imageId}/${userInfo.username}`
    )

    onValue(userLikedCommentsRef, (snapshot) => {
      if (snapshot.exists()) {
        setLikedComments(snapshot.val())
      }
    })

    return () => off(userLikedCommentsRef)
  }, [])

  return (
    <Box>
      <Flex align='center' justify='space-between' gridGap={3}>
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
          commentTotalLikes={commentTotalLikes}
          setCommentTotalLikes={setCommentTotalLikes}
          likedComments={likedComments}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
        />
      </Flex>
    </Box>
  )
}

export { Comment }
