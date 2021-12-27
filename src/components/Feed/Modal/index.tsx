import {
  Modal as CModal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Flex,
  Grid,
  Link,
  Text,
  Heading,
  Divider,
} from '@chakra-ui/react'
import { captureException } from '@sentry/nextjs'
import { MdOutlineVisibility } from 'react-icons/md'
import {
  set,
  ref,
  onValue,
  onChildAdded,
  off,
  increment,
  query,
  limitToLast,
  orderByKey,
} from 'firebase/database'
import { useState, useEffect } from 'react'
import NextImage from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

// components
import { Comments } from './Comments'
import { ActionNavBar } from './ActionNavBar'
import { AddComment } from './ActionNavBar/AddComment'

// hooks
import { useHandleError } from '../../../hooks/useHandleError'

// firebase services
import { db } from '../../../services/firebase/database'

// types
import type { AuthError } from 'firebase/auth'
import type { DatabaseReference } from 'firebase/database'
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

  // hooks
  const router = useRouter()
  const { handleError } = useHandleError()

  // the two useEffect below are used to handle user pressing mobile back button
  useEffect(() => {
    isOpen
      ? router.push('/', `/photo/${imageInfo.id}`, { shallow: true })
      : router.push('/', '/', { shallow: true })
  }, [isOpen])

  useEffect(() => {
    const handleRouteChange = (url: string) =>
      url === '/' ? onClose() : undefined

    router.events.on('routeChangeStart', handleRouteChange)

    return () => router.events.off('routeChangeStart', handleRouteChange)
  }, [])

  // loads the latest comments and listens for new ones
  useEffect(() => {
    const imageCommentsRef = query(
      ref(db, `image_comments/${imageInfo.id}`),
      orderByKey(),
      limitToLast(4)
    )

    onValue(
      imageCommentsRef,
      (snapshot) =>
        snapshot.exists() &&
        setImageComments(Object.values<Comment>(snapshot.val()).reverse()),
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
  }, [])

  // increments image views when modal is open
  useEffect(() => {
    let imageRef: DatabaseReference
    ;(async () => {
      try {
        imageRef = ref(db, `image_metrics/${imageInfo.id}/views`)

        if (isOpen) {
          await set(imageRef, increment(1))

          onValue(
            imageRef,
            (snapshot) => snapshot.exists() && setImageViews(snapshot.val())
          )
        }
      } catch (err) {
        const error = err as AuthError

        switch (error.code) {
          default:
            handleError('default')

            process.env.NODE_ENV === 'production'
              ? captureException(err)
              : console.log({ err })

            break
        }
      }
    })()

    return () => (imageRef ? off(imageRef) : undefined)
  }, [isOpen])

  return (
    <CModal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        minW={[null, null, '80vw']}
        h={[null, null, '100%']}
        alignContent='center'
        justifyContent='center'
      >
        <ModalBody d='flex' flexDirection={['column', null, 'row']}>
          <Box position='relative' w='100%' h={['300px', '400px', '100%']}>
            <NextImage
              src={imageInfo.path}
              alt={imageInfo.description}
              layout='fill'
              objectFit='cover'
              objectPosition='center'
              quality={100}
              priority={true}
            />
          </Box>

          <Grid
            p={3}
            w={[null, null, '600px']}
            templateRows={['min-content 200px 73px', 'min-content 305px 73px']}
            py={[null, null, 5]}
          >
            <Box>
              <Flex justify='space-between' mb={2} opacity={0.5}>
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

                  <Text as='span'>{imageViews || 0}</Text>
                </Flex>
              </Flex>

              <Divider borderColor='#a8a8a8' my={3} />

              <Box>
                <NextLink href={`/photo/${imageInfo.id}`} passHref>
                  <Link>
                    <Heading fontSize={40}>{imageInfo.title}</Heading>
                  </Link>
                </NextLink>

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
            </Box>

            <Comments
              comments={imageComments}
              imageId={imageInfo.id}
              setImageComments={setImageComments}
            />

            <AddComment imageID={imageInfo.id} />
          </Grid>
        </ModalBody>
      </ModalContent>
    </CModal>
  )
}

export { Modal }
