import { useState, useEffect } from 'react'
import { Box, Flex, Link, Text } from '@chakra-ui/react'
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from 'react-icons/md'
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

// hooks
import { useUser } from '../../../../hooks/useUser'

// firebase
import { db } from '../../../../services/firebase/database'

// types
import type { Comment } from '../../../../typings/userInfo'

type UserCommentProps = {
  comment: Comment
  imageId: string
}

type IsLiked = {
  isLiked: boolean | null
  didUserLikedNow: boolean | null
}

type LikedComments = { [key: string]: string }

function UserComment({ comment, imageId }: UserCommentProps) {
  // states
  const [isLiked, setIsLiked] = useState<IsLiked>({
    isLiked: null,
    didUserLikedNow: null,
  })
  const [commentTotalLikes, setImageTotalLikes] = useState(comment.likes)
  const [likedComments, setLikedComments] = useState<LikedComments>({})
  // hooks
  const { userInfo } = useUser()

  useEffect(() => {
    const likedCommentRef = ref(
      db,
      `/image_comments/${imageId}/${userInfo.username}/${
        likedComments[comment.id]
      }`
    )

    if (
      likedCommentRef.key !== 'undefined' &&
      isLiked.didUserLikedNow === null
    ) {
      setIsLiked({ isLiked: true, didUserLikedNow: false })
    }

    return () => {
      off(likedCommentRef)
    }
  }, [likedComments])

  useEffect(() => {
    const likedCommentRef = ref(db, `/image_comments/${imageId}/${comment.id}`)
    const userLikedCommentsRef = ref(
      db,
      `/liked_comments/${imageId}/${userInfo.username}`
    )

    if (isLiked.isLiked === true && isLiked?.didUserLikedNow === true) {
      update(likedCommentRef, {
        likes: increment(1),
      })

      push(userLikedCommentsRef, comment.id)
    } else if (isLiked.isLiked === false && isLiked?.didUserLikedNow === true) {
      if (commentTotalLikes > 0) {
        update(likedCommentRef, {
          likes: increment(-1),
        })
      }

      remove(
        ref(
          db,
          `/liked_comments/${imageId}/${userInfo.username}/${
            likedComments[comment.id]
          }`
        )
      )
    }

    // updates the total of likes
    onValue(likedCommentRef, (snapshot) => {
      if (snapshot.exists()) {
        setImageTotalLikes(snapshot.val().likes)
      }
    })

    // update the array of liked comments
    onValue(userLikedCommentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const objs = snapshot.val()
        const formattedValues: { [key: string]: string } = {}

        for (const key in objs) {
          formattedValues[objs[key]] = key
        }

        setLikedComments(formattedValues)
      }
    })

    return () => {
      off(likedCommentRef)
      off(userLikedCommentsRef)
    }
  }, [isLiked.isLiked])

  console.log(isLiked)

  return (
    <Box>
      <Flex align='center' justify='space-between'>
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

        <Box>
          {isLiked.isLiked ? (
            <MdOutlineFavorite
              onClick={() =>
                setIsLiked({
                  isLiked: false,
                  didUserLikedNow: true,
                })
              }
              cursor='pointer'
              color='#fb1'
            />
          ) : (
            <MdOutlineFavoriteBorder
              onClick={() =>
                setIsLiked({
                  isLiked: true,
                  didUserLikedNow: true,
                })
              }
              cursor='pointer'
            />
          )}
        </Box>
      </Flex>
    </Box>
  )
}

export { UserComment }
