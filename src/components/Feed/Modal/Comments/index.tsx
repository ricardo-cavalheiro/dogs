import { Box, Text, SlideFade } from '@chakra-ui/react'

// components
import { Comment } from './Comment'

// types
import type { Comment as CommentType } from '../../../../typings/userInfo'

type CommentsProps = {
  comments: CommentType[]
  imageId: string
}

function Comments({ comments, imageId }: CommentsProps) {
  return (
    <Box as='ul' className='comments-wrapper' overflowY='auto' mb={2}>
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
  )
}

export { Comments }
