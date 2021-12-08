import { Grid, Box, Flex, Text, useDisclosure } from '@chakra-ui/react'
import NextImage from 'next/image'
import { MdOutlineVisibility, MdFavorite } from 'react-icons/md'

// components
import { Modal } from './Modal'

// types
import type { ImageInfo } from '../../../typings/userInfo'

type CardProps = {
  imageInfo: ImageInfo
  isAboveTheFold: boolean
}

function Card({ imageInfo, isAboveTheFold }: CardProps) {
  const { onOpen, onClose, isOpen } = useDisclosure()

  return (
    <>
      <Box
        as='li'
        position='relative'
        borderRadius='base'
        overflow='hidden'
        cursor='pointer'
        height='200px'
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
          layout='fill'
          quality={30}
          priority={isAboveTheFold}
        />

        <Flex
          gridGap={3}
          d='none'
          className='post-info'
          zIndex={2}
          transition='200ms'
          position='absolute'
          bg='rgba(0, 0, 0, 0.4)'
          h='100%'
          w='100%'
          align='center'
          justify='center'
        >
          <Flex align='center' gridGap={1}>
            <MdOutlineVisibility size={30} color='white' />
            <Text as='span' fontWeight='bold' color='light.100'>
              {imageInfo.views}
            </Text>
          </Flex>

          <Flex align='center' gridGap={1}>
            <MdFavorite size={30} color='#fb1' />
            <Text as='span' fontWeight='bold' color='light.100'>
              {imageInfo.likes}
            </Text>
          </Flex>
        </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} imageInfo={imageInfo} />
    </>
  )
}

type Props = {
  images: ImageInfo[]
}

function FeedGrid({ images }: Props) {
  return (
    <Grid as='ul' mt={5} gap={5}>
      {images.map((image, index) => (
        <Card
          key={image.id}
          imageInfo={image}
          isAboveTheFold={index < 3 && true}
        />
      ))}
    </Grid>
  )
}

export { FeedGrid }
