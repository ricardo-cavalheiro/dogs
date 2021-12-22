import { useEffect, useState } from 'react'
import { captureException } from '@sentry/nextjs'
import { useToast } from '@chakra-ui/react'
import {
  ref,
  query,
  limitToLast,
  orderByKey,
  endBefore,
  onValue,
  off,
} from 'firebase/database'
import { parseCookies } from 'nookies'
import { getAuth } from 'firebase-admin/auth'
import { getDatabase } from 'firebase-admin/database'

// hooks
import { useUser } from '../../hooks/contexts/useUser'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'

// firebase services
import { db } from '../../services/firebase/database'
import { adminApp } from '../../services/firebase/admin'

// layout
import { UserHeader } from '../../components/layout/UserHeader'
import { Feed } from '../../components/Feed'

// types
import type { GetServerSideProps } from 'next'
import type { Query } from 'firebase/database'
import type { ImageInfo } from '../../typings/userInfo'

const getServerSideProps: GetServerSideProps = async (context) => {
  const userToken = parseCookies(context)['@dogs:token']

  if (!userToken) return { redirect: { destination: '/', permanent: false } }

  try {
    const auth = getAuth(adminApp)
    const user = await auth.verifyIdToken(userToken)

    const db = getDatabase(adminApp)
    const ref = db.ref(`images/${user.uid}`).orderByKey().limitToLast(4)
    const snapshot = await ref.once('value')

    if (snapshot.exists())
      return {
        props: {
          firebaseImages: Object.values<ImageInfo>(snapshot.val()).reverse(),
        },
      }
    else
      return {
        props: {
          firebaseImages: [],
        },
      }
  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      captureException(err)
    } else {
      console.log({ err })
    }

    return {
      redirect: {
        destination: '/',
        permanent: false,
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
  const toast = useToast()
  const { userInfo } = useUser()
  const { shouldLoadMoreItems } = useInfiniteScroll('footer')

  useEffect(() => {
    if (images.length === 0) return

    if (!shouldLoadMoreItems || isLastPage) return

    let moreImagesRef: Query

    try {
      const lastImageID = images.at(-1)?.id as string

      moreImagesRef = query(
        ref(db, `images/${userInfo.uid}`),
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
      if (process.env.NODE_ENV === 'production') {
        captureException(err)
      } else {
        console.log({ err })
      }

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
