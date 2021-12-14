import { MdModeComment, MdOutlineModeComment } from 'react-icons/md'

// types
import type { Dispatch, SetStateAction } from 'react'

type Props = {
  isCommentInputShown: boolean
  setIsCommentInputShown: Dispatch<SetStateAction<boolean>>
}

function AddComment({ isCommentInputShown, setIsCommentInputShown }: Props) {
  return (
    <>
      {isCommentInputShown ? (
        <MdModeComment
          size={30}
          color='#fb1'
          cursor='pointer'
          onClick={() => setIsCommentInputShown(!isCommentInputShown)}
        />
      ) : (
        <MdOutlineModeComment
          size={30}
          color='#333'
          cursor='pointer'
          onClick={() => setIsCommentInputShown(!isCommentInputShown)}
        />
      )}
    </>
  )
}

export { AddComment }
