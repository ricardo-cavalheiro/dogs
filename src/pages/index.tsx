import { useEffect, useState } from 'react'
import { Box, useToast } from '@chakra-ui/react'
import {
  ref,
  query,
  limitToLast,
  endBefore,
  orderByKey,
  onValue,
  get,
  off,
} from 'firebase/database'

// components
import { Feed } from '../components/Feed'

// firebase
import { db } from '../services/firebase/database'

// hooks
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'

// type
import type { GetStaticProps } from 'next'
import type { Query } from 'firebase/database'
import type { ImageInfo } from '../typings/userInfo'

const getStaticProps: GetStaticProps = async () => {
  try {
    const latestImagesRef = query(ref(db, 'latest_images'), limitToLast(4))

    const firebaseImages = await get(latestImagesRef)
    off(latestImagesRef)

    if (firebaseImages.exists()) {
      return {
        props: {
          firebaseImages: Object.values<ImageInfo>(
            firebaseImages.val()
          ).reverse(),
        },
      }
    } else {
      return {
        props: {
          firebaseImages: [],
        },
      }
    }
  } catch (err) {
    const error = err as Error

    console.log('erro ao buscar as imagens mais recentes', { error })

    return {
      props: {
        error: error.message,
      },
    }
  }
}

type Props = {
  firebaseImages: ImageInfo[]
}

function Home({ firebaseImages }: Props) {
  const [images, setImages] = useState(firebaseImages)
  const [isLastPage, setIsLastPage] = useState(false)

  // hooks
  const toast = useToast()
  const { shouldLoadMoreItems } = useInfiniteScroll()

  // infinite scroll
  useEffect(() => {
    if (images.length === 0) return

    if (!shouldLoadMoreItems || isLastPage) return

    let moreImagesRef: Query

    try {
      const lastImageID = images.at(-1)?.id as string

      moreImagesRef = query(
        ref(db, 'latest_images'),
        orderByKey(),
        endBefore(lastImageID),
        limitToLast(4)
      )

      onValue(moreImagesRef, (snapshot) => {
        if (snapshot.exists()) {
          const images = Object.values<ImageInfo>(snapshot.val()).reverse()

          if (images.length < 4) setIsLastPage(true)

          setImages((prevImages) => [...prevImages, ...images])
        }
      })
    } catch (err) {
      console.log('houve um erro ao buscar mais imagens no scroll infinito', {
        err,
      })

      toast({
        title: 'Não conseguimos carregar mais imagens.',
        description: 'Por favor, tente novamente em alguns instantes.',
        duration: 5000,
        isClosable: true,
        status: 'error',
      })
    }

    return () => off(moreImagesRef)
  }, [shouldLoadMoreItems])

  return (
    <Box as='main' p={5}>
      <Feed images={images} />
    </Box>
  )
}

export { getStaticProps }

export default Home
