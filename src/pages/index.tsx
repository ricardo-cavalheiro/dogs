import { useEffect, useState } from 'react'
import { Box, useToast } from '@chakra-ui/react'
import { ref, onValue, off } from 'firebase/database'

// components
import { Feed } from '../components/Feed'

// firebase
import { db } from '../services/firebase/database'

// type
import type { DatabaseReference } from 'firebase/database'
import type { ImageInfo } from '../typings/userInfo'

function Home() {
  const [images, setImages] = useState<ImageInfo[]>([])

  // hooks
  const toast = useToast()

  useEffect(() => {
    let latestImagesRef: DatabaseReference

    try {
      latestImagesRef = ref(db, 'latest_images')

      onValue(latestImagesRef, (snapshot) => {
        if (snapshot.exists()) {
          setImages(Object.values(snapshot.val()))
        } else {
          setImages([])
        }
      })
    } catch (err) {
      console.log('erro ao buscar as imagens mais recentes', { err })

      toast({
        status: 'error',
        duration: 5000,
        isClosable: true,
        title: 'Houve um erro ao buscar o feed.',
        description: 'Mas já estamos trabalhando para resolver esse problema.',
      })
    }

    return () => {
      off(latestImagesRef)
    }
  }, [])

  return (
    <Box as='main' p={5}>
      <Feed images={images} />
    </Box>
  )
}

export default Home
