import { useEffect, useState } from 'react'
import { ref, onValue, off } from 'firebase/database'

// hooks
import { useUser } from '../../hooks/useUser'

// firebase
import { db } from '../../services/firebase/database'

// layout
import { UserHeader } from '../../components/layout/UserHeader'
import { FeedGrid } from '../../components/layout/Feed/Grid'

// types
import type { ImageInfo } from '../../typings/userInfo'

function Account() {
  // states
  const [images, setImages] = useState<ImageInfo[]>([])

  // hooks
  const { userInfo } = useUser()

  useEffect(() => {
    const imageListRef = ref(db, `images/${userInfo.username}`)

    onValue(imageListRef, (snapshot) => {
      if (snapshot.exists()) {
        setImages(Object.values(snapshot.val()))
      }
    })

    return () => {
      off(imageListRef)
    }
  }, [])

  return <FeedGrid images={images} />
}

Account.UserHeader = UserHeader

export default Account
