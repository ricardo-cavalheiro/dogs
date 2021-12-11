import { useEffect, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import {
  ref,
  query,
  limitToLast,
  get,
  orderByKey,
  endBefore,
  onValue,
  off,
} from 'firebase/database'

// hooks
import { useUser } from '../../hooks/useUser'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'

// firebase
import { db } from '../../services/firebase/database'

// layout
import { UserHeader } from '../../components/layout/UserHeader'
import { Feed } from '../../components/Feed'

// types
import type { GetServerSideProps } from 'next'
import type { Query } from 'firebase/database'
import type { ImageInfo } from '../../typings/userInfo'

const getServerSideProps: GetServerSideProps = async (context) => {
  const params = context.params

  try {
    const latestImagesRef = query(
      ref(db, `images/${params?.username}`),
      limitToLast(4)
    )

    const firebaseImages = await get(latestImagesRef)
    off(latestImagesRef)

    if (firebaseImages.exists()) {
      return {
        props: {
          firebaseImages: Object.values(
            firebaseImages.val() as ImageInfo[]
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
        firebaseImages: [],
      },
    }
  }
}

type Props = {
  firebaseImages: ImageInfo[]
}

function Account({ firebaseImages }: Props) {
  // states
  const [images, setImages] = useState<ImageInfo[]>(firebaseImages)
  const [isLastPage, setIsLastPage] = useState(false)

  // hooks
  const { userInfo } = useUser()
  const { shouldLoadMoreItems } = useInfiniteScroll()
  const toast = useToast()

  useEffect(() => {
    if (!images.length) return
    
    if (!shouldLoadMoreItems || isLastPage) return

    let moreImagesRef: Query

    try {
      const lastImageID = images.at(-1)?.id as string

      moreImagesRef = query(
        ref(db, `images/${userInfo.username}`),
        orderByKey(),
        endBefore(lastImageID),
        limitToLast(4)
      )

      onValue(moreImagesRef, (snapshot) => {
        if (snapshot.exists()) {
          const images = Object.values(snapshot.val() as ImageInfo[]).reverse()

          if (images.length < 4) {
            setIsLastPage(true)
          }

          setImages((prevImages) => [...prevImages, ...images])
        }
      })
    } catch (err) {
      console.log('fetching images', { err })

      toast({
        status: 'error',
        duration: 5000,
        isClosable: true,
        title: 'Houve um erro ao buscar suas fotos.',
        description: 'Mas já estamos trabalhando para resolver.',
      })
    }

    return () => {
      off(moreImagesRef)
    }
  }, [shouldLoadMoreItems])

  return <Feed images={images} />
}

Account.UserHeader = UserHeader

export { getServerSideProps }

export default Account
