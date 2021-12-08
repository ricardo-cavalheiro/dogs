import { Box } from '@chakra-ui/react'

// components
import { UserComment } from './UserComment'

// types
import type { Comment } from '../../../../typings/userInfo'

type CommentsSectionProps = {
  comments: Comment[]
  imageId: string
}

function CommentsSection({ comments, imageId }: CommentsSectionProps) {
  return (
    <Box>
      {comments.map((comment) => (
        <UserComment
          key={comment.id}
          comment={comment}
          imageId={imageId}
        />
      ))}
    </Box>
  )
}

export { CommentsSection }
