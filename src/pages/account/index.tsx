import { useEffect, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { ref, onValue, off } from 'firebase/database'

// hooks
import { useUser } from '../../hooks/useUser'

// firebase
import { db } from '../../services/firebase/database'

// layout
import { UserHeader } from '../../components/layout/UserHeader'
import { Feed } from '../../components/Feed'

// types
import type { DatabaseReference } from 'firebase/database'
import type { ImageInfo } from '../../typings/userInfo'

function Account() {
  // states
  const [images, setImages] = useState<ImageInfo[]>([])

  // hooks
  const { userInfo } = useUser()
  const toast = useToast()

  useEffect(() => {
    let imageListRef: DatabaseReference

    try {
      imageListRef = ref(db, `images/${userInfo.username}`)

      onValue(imageListRef, (snapshot) => {
        if (snapshot.exists()) {
          setImages(Object.values(snapshot.val()))
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
      off(imageListRef)
    }
  }, [])

  return <Feed images={images} />
}

Account.UserHeader = UserHeader

export default Account
