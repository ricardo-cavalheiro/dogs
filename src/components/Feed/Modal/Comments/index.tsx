import { Box, Flex, Text, SlideFade } from '@chakra-ui/react'

// components
import { Comment } from './Comment'
import { LoadMoreComments } from './LoadMoreComments'

// types
import type { Comment as CommentType } from '../../../../typings/userInfo'
import type { Dispatch, SetStateAction } from 'react'

type CommentsProps = {
  imageId: string
  comments: CommentType[]
  setImageComments: Dispatch<SetStateAction<CommentType[]>>
}

function Comments({ comments, imageId, setImageComments }: CommentsProps) {
  return (
    <Flex overflowY='auto' direction='column' pr={[2, 5]}>
      <Box as='ul' mb={2}>
        {comments.length === 0 ? (
          <Text>Nenhum comentário ainda...</Text>
        ) : (
          comments.map((comment) => (
            <SlideFade in={true} key={comment.id}>
              <Comment comment={comment} imageId={imageId} />
            </SlideFade>
          ))
        )}
      </Box>

      <LoadMoreComments
        imageID={imageId}
        imageComments={comments}
        setImageComments={setImageComments}
      />
    </Flex>
  )
}

export { Comments }
