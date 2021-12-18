import {
  Modal as CModal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Flex,
  Link,
  Text,
  Heading,
  Divider,
} from '@chakra-ui/react'
import { MdOutlineVisibility } from 'react-icons/md'
import { update, ref, onValue, off, increment } from 'firebase/database'
import { useState, useEffect } from 'react'
import NextImage from 'next/image'
import NextLink from 'next/link'

// components
import { Comments } from './Comments'
import { ActionNavBar } from './ActionNavBar'

// firebase services
import { db } from '../../../services/firebase/database'

// types
import type { DatabaseReference, Query } from 'firebase/database'
import type { ImageInfo, Comment } from '../../../typings/userInfo'

type Props = {
  isOpen: boolean
  onClose: () => void
  imageInfo: ImageInfo
}

function Modal({ isOpen, onClose, imageInfo }: Props) {
  // states
  const [imageComments, setImageComments] = useState<Comment[]>([])
  const [imageViews, setImageViews] = useState(imageInfo.views)

  // loads the latest comments and listens for new ones
  useEffect(() => {
    let imageCommentsRef: Query

    try {
      imageCommentsRef = ref(db, `image_comments/${imageInfo.id}`)

      onValue(imageCommentsRef, (snapshot) => {
        if (snapshot.exists()) {
          setImageComments(Object.values<Comment>(snapshot.val()))
        } else {
          setImageComments([])
        }
      })
    } catch (err) {
      console.log('erro ao atualizar a lista de comentarios', { err })

      setImageComments([])
    }

    return () => off(imageCommentsRef)
  }, [])

  // increments image views when modal is open
  useEffect(() => {
    let imageRef: DatabaseReference
    ;(async () => {
      try {
        imageRef = ref(
          db,
          `images/${imageInfo.author_username}/${imageInfo.id}`
        )

        if (isOpen) {
          await update(imageRef, {
            views: increment(1),
          })

          onValue(imageRef, (snapshot) => {
            if (snapshot.exists()) {
              setImageViews(snapshot.val().views)
            }
          })
        }
      } catch (err) {
        console.log('erro incrementando total de views da imagem', { err })

        setImageViews(0)
      }
    })()

    return () => off(imageRef)
  }, [isOpen])

  return (
    <CModal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Box position='relative'>
            <NextImage
              src={imageInfo.path}
              alt={imageInfo.description}
              layout='responsive'
              height='200px'
              width='200px'
              priority={true}
            />
          </Box>

          <Box px={3} py={2}>
            <Flex justify='space-between' mt={2} mb={2} opacity={0.5}>
              <Box>
                <NextLink
                  href={`/account/${imageInfo.author_username}`}
                  passHref
                >
                  <Link>@{imageInfo.author_username}</Link>
                </NextLink>
              </Box>

              <Flex align='center' gridGap={1}>
                <MdOutlineVisibility size={20} />

                <Text as='span'>{imageViews}</Text>
              </Flex>
            </Flex>

            <Divider borderColor='#a8a8a8' my={3} />

            <Box>
              <Heading fontSize={40}>{imageInfo.title}</Heading>

              {/* this avoids react rendering an empty `p` tag */}
              {imageInfo.description && (
                <Text as='p' mt={5}>
                  {imageInfo.description}
                </Text>
              )}
            </Box>

            <Divider borderColor='#a8a8a8' my={3} />

            <ActionNavBar imageInfo={imageInfo} />

            <Divider borderColor='#a8a8a8' my={3} />

            <Comments comments={imageComments} imageId={imageInfo.id} />
          </Box>
        </ModalBody>
      </ModalContent>
    </CModal>
  )
}

export { Modal }
