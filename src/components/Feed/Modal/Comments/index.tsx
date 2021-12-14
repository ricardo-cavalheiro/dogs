import { Box, Text } from '@chakra-ui/react'

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
    <Box>
      {comments.length === 0 ? (
        <Text>Nenhum comentário ainda...</Text>
      ) : (
        comments.map((comment) => (
          <Comment key={comment.id} comment={comment} imageId={imageId} />
        ))
      )}
    </Box>
  )
}

export { Comments }
