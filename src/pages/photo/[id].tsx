import { useState, useEffect } from 'react'
import { Box, Flex, Grid, Link, Text, Heading, Divider } from '@chakra-ui/react'
import { captureException } from '@sentry/nextjs'
import {
  ref,
  onValue,
  orderByKey,
  limitToLast,
  query,
  set,
  increment,
  off,
} from 'firebase/database'
import { MdOutlineVisibility } from 'react-icons/md'
import { getDatabase } from 'firebase-admin/database'
import NextLink from 'next/link'
import NextImage from 'next/image'
import Head from 'next/head'

// components
import { ActionNavBar } from '../../components/Feed/Modal/ActionNavBar'
import { Comments } from '../../components/Feed/Modal/Comments'
import { AddComment } from '../../components/Feed/Modal/ActionNavBar/AddComment'

// hooks
import { useUser } from '../../hooks/contexts/useUser'
import { useHandleError } from '../../hooks/useHandleError'

// firebase services
import { adminApp } from '../../services/firebase/admin'
import { db } from '../../services/firebase/database'

// types
import type { FirebaseError } from 'firebase/app'
import type { GetServerSideProps } from 'next'
import type { ImageInfo, Comment } from '../../typings/userInfo'
import type { DatabaseReference } from 'firebase/database'

const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query as { id: string }

  try {
    const db = getDatabase(adminApp)
    const imageRef = db.ref(`latest_images/${id}`)
    const snapshot = await imageRef.once('value')

    return snapshot.exists()
      ? { props: { imageInfo: snapshot.val() } }
      : { notFound: true }
  } catch (err) {
    process.env.NODE_ENV === 'production'
      ? captureException(err)
      : console.log('houve um erro ao buscar as informações da imagem', { err })

    return {
      notFound: true,
    }
  }
}

type Props = {
  imageInfo: ImageInfo
}

function Photo({ imageInfo }: Props) {
  // states
  const [imageComments, setImageComments] = useState<Comment[]>([])
  const [imageViews, setImageViews] = useState(imageInfo.views)

  // hooks
  const { userInfo } = useUser()
  const { handleError } = useHandleError()

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
        const error = err as FirebaseError

        console.log({error})

        handleError({ error, silent: true })
      }
    )

    return () => off(imageCommentsRef)
  }, [])

  // increments image views
  useEffect(() => {
    let imageRef: DatabaseReference

    if (userInfo.isLoggedIn) {
      ;(async () => {
        try {
          imageRef = ref(db, `image_metrics/${imageInfo.id}/views`)

          await set(imageRef, increment(1))

          onValue(
            imageRef,
            (snapshot) => snapshot.exists() && setImageViews(snapshot.val()),
            (err) => {
              const error = err as FirebaseError

              handleError({ error, silent: true })
            }
          )
        } catch (err) {
          const error = err as FirebaseError

          handleError({ error, silent: true })
        }
      })()
    }

    return () => (imageRef ? off(imageRef) : undefined)
  }, [userInfo.isLoggedIn])

  return (
    <>
      <Head>
        <title>Dogs | {imageInfo.title}</title>
      </Head>

      <Flex
        p={[5, 5, '20px 0px']}
        mx='auto'
        as='main'
        columnGap={5}
        maxW='768px'
        width='100%'
        direction={['column', 'row']}
      >
        <Box
          position='relative'
          flexBasis={[null, '70%']}
          h={['300px', '100%']}
          borderRadius='base'
          overflow='hidden'
        >
          <NextImage
            src={imageInfo.path}
            alt={imageInfo.title}
            layout='fill'
            objectFit='cover'
            objectPosition='center'
            quality={100}
            priority={true}
          />
        </Box>

        <Grid
          flexBasis='30%'
          h='calc(100vh - 40px)'
          templateRows='auto 1fr auto'
        >
          <Box>
            <Flex
              justify='space-between'
              columnGap={5}
              mt={2}
              mb={2}
              opacity={0.5}
            >
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
          </Box>

          <Comments
            comments={imageComments}
            imageId={imageInfo.id}
            setImageComments={setImageComments}
          />

          <AddComment imageID={imageInfo.id} />
        </Grid>
      </Flex>
    </>
  )
}

export { getServerSideProps }

export default Photo
