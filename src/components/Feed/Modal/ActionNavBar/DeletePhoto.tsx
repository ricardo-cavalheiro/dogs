import { useState, useRef } from 'react'
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogCloseButton,
  Button,
  Text,
  useToast,
  useDisclosure,
  useColorMode,
} from '@chakra-ui/react'
import { MdDeleteOutline, MdDelete } from 'react-icons/md'
import { ref as databaseRef, update } from 'firebase/database'
import { ref as storageRef, deleteObject } from 'firebase/storage'
import { useRouter } from 'next/router'

// hooks
import { useUser } from '../../../../hooks/contexts/useUser'
import { useHandleError } from '../../../../hooks/useHandleError'

// firebase services
import { db } from '../../../../services/firebase/database'
import { storage } from '../../../../services/firebase/storage'

// types
import type { FirebaseError } from 'firebase/app'
import type { ImageInfo } from '../../../../typings/userInfo'

type ConfirmationAlertProps = {
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  imageInfo: ImageInfo
}

function ConfirmationAlert({
  isOpen,
  onToggle,
  onClose,
  imageInfo,
}: ConfirmationAlertProps) {
  // states
  const [isDeleting, setIsDeleting] = useState(false)

  // hooks
  const toast = useToast()
  const router = useRouter()
  const { userInfo } = useUser()
  const closeAlertRef = useRef(null)
  const { colorMode } = useColorMode()
  const { handleError } = useHandleError()

  async function deletePhoto() {
    setIsDeleting(true)

    try {
      const storageImageRef = storageRef(
        storage,
        `images/${userInfo.uid}/${imageInfo.id}`
      )

      const updates = {
        [`comment_metrics/${imageInfo.id}`]: null,
        [`image_comments/${imageInfo.id}`]: null,
        [`image_metrics/${imageInfo.id}`]: null,
        [`images/${imageInfo.author_id}/${imageInfo.id}`]: null,
        [`latest_images/${imageInfo.id}`]: null,
        [`liked_comments/${imageInfo.id}`]: null,
        [`liked_images/${imageInfo.id}`]: null,
      }

      await Promise.all([
        update(databaseRef(db), updates),
        deleteObject(storageImageRef),
      ])

      toast({
        title: 'Foto apagada!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        onCloseComplete: () => router.push('/'),
      })
    } catch (err) {
      const error = err as FirebaseError

      handleError({ error })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={closeAlertRef}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader
          color={`${colorMode === 'light' ? 'light.800' : 'dark.50'}`}
        >
          Deletar foto
          <AlertDialogCloseButton />
        </AlertDialogHeader>

        <AlertDialogBody sx={{ padding: '10px 24px 0' }}>
          <Text>Após deletar sua foto, não há como recuperá-la.</Text>
        </AlertDialogBody>

        <AlertDialogFooter
          gridGap={3}
          justifyContent='space-between'
          transition='200ms'
        >
          <Button
            w='100%'
            variant='cancel'
            onClick={onToggle}
            ref={closeAlertRef}
          >
            Cancelar
          </Button>

          <Button
            w='100%'
            onClick={deletePhoto}
            isLoading={isDeleting}
            loadingText='Apagando...'
            _loading={{
              justifyContent: 'flex-start',
            }}
            overflow='hidden'
          >
            Deletar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

type Props = {
  imageInfo: ImageInfo
}

function DeletePhoto({ imageInfo }: Props) {
  // hooks
  const { colorMode } = useColorMode()
  const { isOpen, onToggle, onClose } = useDisclosure()

  return (
    <>
      {isOpen ? (
        <MdDelete size={30} tabIndex={0} color='#fb1' cursor='pointer' />
      ) : (
        <MdDeleteOutline
          size={30}
          tabIndex={0}
          color={`${colorMode === 'light' ? '#333' : '#fff'}`}
          cursor='pointer'
          onClick={onToggle}
          onKeyDown={({ key }) => key === 'Enter' && onToggle}
        />
      )}

      <ConfirmationAlert
        isOpen={isOpen}
        onToggle={onToggle}
        onClose={onClose}
        imageInfo={imageInfo}
      />
    </>
  )
}

export { DeletePhoto }
