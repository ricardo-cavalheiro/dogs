import { useState, useRef } from 'react'
import { captureException } from '@sentry/nextjs'
import {
  Flex,
  Text,
  Button,
  AlertDialog,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { ref as databaseRef, update } from 'firebase/database'
import { ref as storageRef, deleteObject, listAll } from 'firebase/storage'
import { deleteUser } from 'firebase/auth'

// hooks
import { useUser } from '../../../hooks/contexts/useUser'

// firebase services
import { auth } from '../../../services/firebase/auth'
import { db } from '../../../services/firebase/database'
import { storage } from '../../../services/firebase/storage'

// types
import type { MutableRefObject } from 'react'

type DeleteAccountAlertDialogProps = {
  isOpen: boolean
  onToggle: () => void
  leastDestructiveRef: MutableRefObject<null>
}

function DeleteAccountAlertDialog({
  isOpen,
  onToggle,
  leastDestructiveRef,
}: DeleteAccountAlertDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  // hooks
  const { userInfo, signUserOut } = useUser()
  const toast = useToast()

  async function deleteAccount() {
    try {
      setIsDeleting(true)

      const ref = storageRef(storage, `/images/${userInfo.username}`)
      const fileList = await listAll(ref)

      const updatesList = fileList.items.map((image) => ({
        [`image_comments/${image.name}`]: null,
        [`images/${userInfo.username}`]: null,
        [`latest_images/${image.name}`]: null,
        [`liked_comments/${image.name}`]: null,
        [`liked_images/${image.name}`]: null,
      }))

      const deleteFiles = () => {
        const fileListPromises: Promise<any>[] = []

        const deleteFile = (filePath: string) => {
          const ref = storageRef(storage, filePath)

          fileListPromises.push(deleteObject(ref))
        }

        for (const file of fileList.items) {
          deleteFile(file.fullPath)
        }

        return fileListPromises
      }

      await Promise.allSettled([
        ...updatesList.map((item) => update(databaseRef(db), item)),
        ...deleteFiles(),
        deleteUser(auth.currentUser!),
      ])
    } catch (err) {
      if (process.env.NODE_ENV === 'production') {
        captureException(err)
      } else {
        console.log({ err })
      }

      toast({
        title: 'Não conseguimos deletar sua conta.',
        description: 'Por favor, tente novamente em alguns instantes.',
        isClosable: true,
        duration: 5000,
        status: 'error',
      })
    } finally {
      setIsDeleting(false)

      signUserOut()
    }
  }

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onToggle}
      leastDestructiveRef={leastDestructiveRef}
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader boxShadow='0 1px 1px rgb(0 0 0 / 10%)' px={5} pb={2}>
          Tem certeza?
          <AlertDialogCloseButton />
        </AlertDialogHeader>

        <AlertDialogBody mx={5} mt={2}>
          <Text>
            Ao deletar sua conta, todas suas fotos, curtidas e comentários
            também serão deletados e não poderão ser recuperados.
          </Text>
        </AlertDialogBody>

        <AlertDialogFooter gridGap={3} justifyContent='space-between' px={5}>
          <Button variant='cancel' onClick={onToggle} flexBasis='50%'>
            Cancelar
          </Button>

          <Button
            onClick={deleteAccount}
            isLoading={isDeleting}
            loadingText='Apagando...'
            flexBasis='50%'
          >
            Confirmar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function DeleteAccount() {
  // hooks
  const closeAlertDialogRef = useRef(null)
  const { isOpen, onToggle } = useDisclosure()

  return (
    <>
      <Flex align='center' justify='space-between'>
        <Text>Apagar minha conta</Text>

        <Button onClick={onToggle}>Apagar</Button>
      </Flex>

      <DeleteAccountAlertDialog
        isOpen={isOpen}
        onToggle={onToggle}
        leastDestructiveRef={closeAlertDialogRef}
      />
    </>
  )
}

export { DeleteAccount }
