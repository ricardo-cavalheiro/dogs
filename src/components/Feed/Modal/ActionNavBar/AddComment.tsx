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
          tabIndex={0}
          color='#fb1'
          cursor='pointer'
          onClick={() => setIsCommentInputShown(!isCommentInputShown)}
          onKeyDown={({ key }) =>
            key === 'Enter' && setIsCommentInputShown(!isCommentInputShown)
          }
        />
      ) : (
        <MdOutlineModeComment
          size={30}
          tabIndex={0}
          color='#333'
          cursor='pointer'
          onClick={() => setIsCommentInputShown(!isCommentInputShown)}
          onKeyDown={({ key }) =>
            key === 'Enter' && setIsCommentInputShown(!isCommentInputShown)
          }
        />
      )}
    </>
  )
}

export { AddComment }
