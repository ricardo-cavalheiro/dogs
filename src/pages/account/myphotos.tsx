import { useEffect, useState } from 'react'
import { captureException } from '@sentry/nextjs'
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
import Head from 'next/head'

// hooks
import { useUser } from '../../hooks/contexts/useUser'
import { useHandleError } from '../../hooks/useHandleError'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'

// firebase services
import { db } from '../../services/firebase/client/database'
import { app } from '../../services/firebase/server/app'

// layout
import { UserHeader } from '../../components/layout/UserHeader'
import { Feed } from '../../components/Feed'

// types
import type { GetServerSideProps } from 'next'
import type { FirebaseError } from 'firebase/app'
import type { ImageInfo } from '../../typings/userInfo'

const getServerSideProps: GetServerSideProps = async (context) => {
  const userToken = parseCookies(context)['@dogs:token']

  if (!userToken) return { redirect: { destination: '/', permanent: false } }

  try {
    const auth = getAuth(app)
    const user = await auth.verifyIdToken(userToken)

    const db = getDatabase(app)
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
    process.env.NODE_ENV === 'production'
      ? captureException(err)
      : console.log({ err })

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
  const { userInfo } = useUser()
  const { handleError } = useHandleError()
  const { shouldLoadMoreItems } = useInfiniteScroll('footer')

  // fetches the 4 latest user posts
  useEffect(() => {
    if (images.length === 0) return

    if (!shouldLoadMoreItems || isLastPage) return

    const lastImageID = images.at(-1)?.id as string

    const moreImagesRef = query(
      ref(db, `images/${userInfo.uid}`),
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
    <>
      <Head>
        <title>Dogs | Minhas fotos</title>
      </Head>

      <Feed images={images} />
    </>
  )
}

Account.UserHeader = UserHeader

export { getServerSideProps }

export default Account
