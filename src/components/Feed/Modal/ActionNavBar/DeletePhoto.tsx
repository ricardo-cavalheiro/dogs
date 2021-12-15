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
} from '@chakra-ui/react'
import { MdDeleteOutline } from 'react-icons/md'
import { ref as databaseRef, update } from 'firebase/database'
import { ref as storageRef, deleteObject } from 'firebase/storage'

// hooks
import { useUser } from '../../../../hooks/contexts/useUser'

// firebase services
import { db } from '../../../../services/firebase/database'
import { storage } from '../../../../services/firebase/storage'

// types
import { ImageInfo } from '../../../../typings/userInfo'

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
  const { userInfo } = useUser()
  const closeAlertRef = useRef(null)

  async function deletePhoto() {
    setIsDeleting(true)

    try {
      const storageImageRef = storageRef(
        storage,
        `images/${userInfo.username}/${imageInfo.id}`
      )

      const updates = {
        [`images/${imageInfo.author_username}/${imageInfo.id}`]: null,
        [`image_comments/${imageInfo.id}`]: null,
        [`liked_comments/${imageInfo.id}`]: null,
        [`liked_images/${imageInfo.id}`]: null,
        [`latest_images/${imageInfo.id}`]: null,
      }

      await update(databaseRef(db), updates)
      await deleteObject(storageImageRef)

      toast({
        title: 'Foto apagada!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (err) {
      console.log('houve um erro ao deletar a foto', { err })

      toast({
        status: 'error',
        duration: 5000,
        isClosable: true,
        title: 'Não foi possível deletar a foto.',
        description: 'Por favor, tente novamente em alguns instantes',
      })
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
          boxShadow='0 1px 1px rgb(0 0 0 / 10%);'
          color='light.800'
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
  const { isOpen, onToggle, onClose } = useDisclosure()

  return (
    <>
      <MdDeleteOutline
        size={30}
        tabIndex={0}
        color='#333'
        cursor='pointer'
        onClick={onToggle}
        onKeyDown={({ key }) => key === 'Enter' && onToggle}
      />

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
