import { useState, useEffect } from 'react'
import { Box, Flex, Link, Text, useToast } from '@chakra-ui/react'
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
import { useUser } from '../../../hooks/useUser'

// firebase
import { db } from '../../../services/firebase/database'

// types
import type { DatabaseReference } from 'firebase/database'
import type { Comment } from '../../../typings/userInfo'

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
  const toast = useToast()

  useEffect(() => {
    let likedCommentRef: DatabaseReference

    try {
      likedCommentRef = ref(
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
    } catch (err) {
      console.log('erro ao ao atualizar os comentarios já curtidos', { err })
    }

    return () => {
      off(likedCommentRef)
    }
  }, [likedComments])

  useEffect(() => {
    let likedCommentRef: DatabaseReference
    let userLikedCommentsRef: DatabaseReference

    try {
      likedCommentRef = ref(db, `/image_comments/${imageId}/${comment.id}`)
      userLikedCommentsRef = ref(
        db,
        `/liked_comments/${imageId}/${userInfo.username}`
      )

      if (isLiked.isLiked === true && isLiked?.didUserLikedNow === true) {
        update(likedCommentRef, {
          likes: increment(1),
        })

        push(userLikedCommentsRef, comment.id)
      } else if (
        isLiked.isLiked === false &&
        isLiked?.didUserLikedNow === true
      ) {
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
    } catch (err) {
      console.log('erro ao atualizar o comentario curtido', { err })

      toast({
        status: 'error',
        duration: 5000,
        isClosable: true,
        title: 'Houve um erro ao curtir o comentário.',
        description: 'Tente de novo daqui uns minutos.',
      })
    }

    return () => {
      off(likedCommentRef)
      off(userLikedCommentsRef)
    }
  }, [isLiked.isLiked])

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
