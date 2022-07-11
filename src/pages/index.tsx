import { useEffect, useState } from 'react'
import * as Sentry from '@sentry/nextjs'
import { Box } from '@chakra-ui/react'
import {
  ref,
  query,
  limitToLast,
  endBefore,
  orderByKey,
  onValue,
  off
} from 'firebase/database'
import { getDatabase } from 'firebase-admin/database'
import Head from 'next/head'

// components
import { Feed } from '../components/Feed'

// firebase services
import { db } from '../services/firebase/client/database'
import { app } from '../services/firebase/server/app'

// hooks
import { useHandleError } from '../hooks/useHandleError'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'

// type
import type { GetStaticProps } from 'next'
import type { FirebaseError } from 'firebase/app'
import type { ImageInfo } from '../typings/userInfo'

const getStaticProps: GetStaticProps = async () => {
  try {
    const db = getDatabase(app)
    const ref = db.ref('latest_images').orderByKey().limitToLast(4)
    const snapshot = await ref.get()

    if (snapshot.exists()) {
      return {
        props: {
          firebaseImages: Object.values<ImageInfo>(snapshot.val()).reverse()
        },
        revalidate: 3600
      }
    } else {
      return {
        props: {
          firebaseImages: []
        }
      }
    }
  } catch (err) {
    const error = err as FirebaseError

    process.env.NODE_ENV === 'production'
      ? Sentry.captureException(error)
      : console.log('erro ao buscar as imagens mais recentes', { error })

    return {
      props: {
        firebaseImages: []
      }
    }
  }
}

type Props = {
  firebaseImages: ImageInfo[]
}

function Home({ firebaseImages }: Props) {
  // states
  const [images, setImages] = useState(firebaseImages)
  const [isLastPage, setIsLastPage] = useState(false)

  // hooks
  const { handleError } = useHandleError()
  const { shouldLoadMoreItems } = useInfiniteScroll('footer')

  // infinite scroll
  useEffect(() => {
    if (images.length === 0) return

    if (shouldLoadMoreItems === false || isLastPage) return

    const lastImageID = images.at(-1)!.id

    const moreImagesRef = query(
      ref(db, 'latest_images'),
      orderByKey(),
      endBefore(lastImageID),
      limitToLast(4)
    )

    onValue(
      moreImagesRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const images = Object.values<ImageInfo>(snapshot.val()).reverse()

          if (images.length < 4) setIsLastPage(true)

          setImages((prevImages) => [...prevImages, ...images])
        }
      },
      (err) => {
        const error = err as FirebaseError

        handleError({ error })
      }
    )

    return () => off(moreImagesRef)
  }, [shouldLoadMoreItems])

  return (
    <Box as='main' p={5}>
      <Head>
        <title>Dogs | Feed</title>
      </Head>

      <Feed images={images} />
    </Box>
  )
}

export { getStaticProps }

export default Home
