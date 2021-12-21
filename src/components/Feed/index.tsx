import { useState, useEffect } from 'react'
import {
  Grid,
  Box,
  Flex,
  Text,
  useDisclosure,
  useBreakpointValue,
} from '@chakra-ui/react'
import { MdOutlineVisibility, MdFavorite } from 'react-icons/md'
import { ref, onValue, off } from 'firebase/database'
import NextImage from 'next/image'

// components
import { Modal } from './Modal'
import { UserNotLoggedInModal } from './UserNotLoggedInModal'

// hooks
import { useUser } from '../../hooks/contexts/useUser'
import { useShimmer } from '../../hooks/useShimmer'

// firebase services
import { db } from '../../services/firebase/database'

// types
import type { ImageInfo } from '../../typings/userInfo'
import type { DatabaseReference } from 'firebase/database'

type CardProps = {
  imageInfo: ImageInfo
  isAboveTheFold: boolean
}

function Card({ imageInfo, isAboveTheFold }: CardProps) {
  // states
  const [imageMetrics, setImageMetrics] = useState({
    likes: imageInfo.likes,
    views: imageInfo.views,
  })

  // hooks
  const { userInfo } = useUser()
  const shimmer = useShimmer(200, 200)
  const { onOpen, onClose, isOpen, onToggle } = useDisclosure()
  const isWideScreen = useBreakpointValue({ sm: false, md: true, lg: true })

  // fetches the total of views and likes for the image
  useEffect(() => {
    let imageRef: DatabaseReference

    try {
      imageRef = ref(db, `image_metrics/${imageInfo.id}`)

      onValue(imageRef, (snapshot) => {
        if (snapshot.exists()) {
          const metrics = snapshot.val()

          setImageMetrics({ likes: metrics.likes, views: metrics.views })
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
          '&:nth-child(3n + 2)': {
            gridColumn: isWideScreen && '2 / 4',
            gridRow: isWideScreen && 'span 2',
          },
        }}
        tabIndex={0}
        transition='200ms'
        _focus={{
          boxShadow: '0 0 0 3px rgba(66, 153, 255, 0.6)',
          outline: '2px solid transparent',
        }}
        onClick={onOpen}
        onKeyDown={({ key }) => (key === 'Enter' ? onToggle() : undefined)} // this type error is probably related to chakra ui
      >
        <NextImage
          src={imageInfo.path}
          alt={imageInfo.description}
          width='200px'
          height='200px'
          layout='responsive'
          objectFit='cover'
          placeholder='blur'
          blurDataURL={shimmer}
          quality={isWideScreen ? 100 : 30}
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
              {imageMetrics.views || 0}
            </Text>
          </Flex>

          <Flex align='center' gridGap={1}>
            <MdFavorite size={30} color='#fb1' />

            <Text as='span' fontWeight='bold' color='light.100'>
              {imageMetrics.likes || 0}
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
    <Grid
      mx='auto'
      maxW='768px'
      as='ul'
      gap={5}
      templateColumns={['1fr', 'repeat(3, 1fr)']}
      className='feed'
    >
      {images.map((image, index) => (
        <Card key={image.id} imageInfo={image} isAboveTheFold={index < 4} />
      ))}
    </Grid>
  )
}

export { Feed }
