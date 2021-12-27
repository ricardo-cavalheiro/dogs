import { Flex } from '@chakra-ui/react'

// components
import { LikePhoto } from './LikePhoto'
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
    <Flex gridGap={2} justifyContent='space-between'>
      <LikePhoto imageInfo={imageInfo} />

      {userInfo.uid === imageInfo.author_id && (
        <DeletePhoto imageInfo={imageInfo} />
      )}
    </Flex>
  )
}

export { ActionNavBar }
