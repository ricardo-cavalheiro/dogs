import { Flex } from '@chakra-ui/react'

// components
import { LikePhoto } from './LikePhoto'
import { AddComment } from './AddComment'
import { DeletePhoto } from './DeletePhoto'

// hooks
import { useUser } from '../../../../hooks/contexts/useUser'

// types
import type { Dispatch, SetStateAction } from 'react'
import type { ImageInfo } from '../../../../typings/userInfo'

type Props = {
  imageInfo: ImageInfo
  isCommentInputShown: boolean
  setIsCommentInputShown: Dispatch<SetStateAction<boolean>>
}

function FooterMenu({
  imageInfo,
  isCommentInputShown,
  setIsCommentInputShown,
}: Props) {
  // hooks
  const { userInfo } = useUser()

  return (
    <Flex gridGap={2}>
      <LikePhoto imageInfo={imageInfo} />

      <AddComment
        isCommentInputShown={isCommentInputShown}
        setIsCommentInputShown={setIsCommentInputShown}
      />

      {userInfo.username === imageInfo.author_username && (
        <DeletePhoto imageInfo={imageInfo} />
      )}
    </Flex>
  )
}

export { FooterMenu }
