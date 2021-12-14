import { useState, useEffect } from 'react'
import { Grid, Box, Flex, Text, useDisclosure } from '@chakra-ui/react'
import { MdOutlineVisibility, MdFavorite } from 'react-icons/md'
import { ref, onValue, off } from 'firebase/database'
import NextImage from 'next/image'

// components
import { Modal } from './Modal'
import { UserNotLoggedInModal } from './UserNotLoggedInModal'

// hooks
import { useUser } from '../../hooks/contexts/useUser'

// firebase
import { db } from '../../services/firebase/database'

// types
import type { DatabaseReference } from 'firebase/database'
import type { ImageInfo } from '../../typings/userInfo'

type CardProps = {
  imageInfo: ImageInfo
  isAboveTheFold: boolean
}

function Card({ imageInfo, isAboveTheFold }: CardProps) {
  // states
  const [totalViews, setTotalViews] = useState(imageInfo.views)
  const [totalLikes, setTotalLikes] = useState(imageInfo.likes)

  // hooks
  const { onOpen, onClose, isOpen } = useDisclosure()
  const { userInfo } = useUser()

  useEffect(() => {
    let imageRef: DatabaseReference

    try {
      imageRef = ref(db, `images/${imageInfo.author_username}/${imageInfo.id}`)

      onValue(imageRef, (snapshot) => {
        if (snapshot.exists()) {
          setTotalViews(snapshot.val().views)
          setTotalLikes(snapshot.val().likes)
        }
      })
    } catch (err) {
      console.log('erro ao buscar as views da foto no feed', { err })
    }

    return () => off(imageRef)
  }, [isOpen])

  return (
    <>
      <Box
        as='li'
        position='relative'
        borderRadius='base'
        overflow='hidden'
        cursor='pointer'
        sx={{
          '&:hover > .post-info': {
            d: 'flex',
          },
        }}
        onClick={onOpen}
      >
        <NextImage
          src={imageInfo.path}
          alt={imageInfo.description}
          width='200px'
          height='200px'
          layout='responsive'
          objectFit='cover'
          placeholder='empty'
          quality={30}
          priority={isAboveTheFold}
        />

        <Flex
          align='center'
          justify='center'
          gridGap={3}
          d='none'
          h='100%'
          w='100%'
          bg='rgba(0, 0, 0, 0.4)'
          className='post-info'
          position='absolute'
          zIndex={2}
          top='0'
          transition='200ms'
        >
          <Flex align='center' gridGap={1}>
            <MdOutlineVisibility size={30} color='white' />
            <Text as='span' fontWeight='bold' color='light.100'>
              {totalViews}
            </Text>
          </Flex>

          <Flex align='center' gridGap={1}>
            <MdFavorite size={30} color='#fb1' />
            <Text as='span' fontWeight='bold' color='light.100'>
              {totalLikes}
            </Text>
          </Flex>
        </Flex>
      </Box>

      {userInfo.isLoggedIn ? (
        <Modal isOpen={isOpen} onClose={onClose} imageInfo={imageInfo} />
      ) : (
        <UserNotLoggedInModal
          isOpen={isOpen}
          onClose={onClose}
          imageID={imageInfo.id}
        />
      )}
    </>
  )
}

type Props = {
  images: ImageInfo[]
}

function Feed({ images }: Props) {
  return (
    <Grid as='ul' gap={5}>
      {images.map((image, index) => (
        <Card
          key={image.id}
          imageInfo={image}
          isAboveTheFold={index < 2 && true}
        />
      ))}
    </Grid>
  )
}

export { Feed }
