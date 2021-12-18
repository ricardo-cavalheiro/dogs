import { Flex, Box } from '@chakra-ui/react'

// components
import { LikePhoto } from './LikePhoto'
import { AddComment } from './AddComment'
import { DeletePhoto } from './DeletePhoto'

// hooks
import { useUser } from '../../../../hooks/contexts/useUser'

// types
import type { ImageInfo } from '../../../../typings/userInfo'

type Props = {
  imageInfo: ImageInfo
}

function ActionNavBar({ imageInfo }: Props) {
  // hooks
  const { userInfo } = useUser()

  return (
    <Flex direction='column'>
      <Flex gridGap={2}>
        <LikePhoto imageInfo={imageInfo} />

        <AddComment imageID={imageInfo.id} />

        {userInfo.username === imageInfo.author_username && (
          <DeletePhoto imageInfo={imageInfo} />
        )}
      </Flex>

      {/* the box below is used to render the comment input through a react portal */}
      <Box className='comment-input-wrapper'></Box>
    </Flex>
  )
}

export { ActionNavBar }
