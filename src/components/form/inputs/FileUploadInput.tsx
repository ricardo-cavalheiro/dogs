import { useEffect, forwardRef, useRef } from 'react'
import { FormLabel, Box, Text, Image, Center } from '@chakra-ui/react'
import { MdOutlineFileUpload } from 'react-icons/md'

// components
import { ErrorMessage } from '../ErrorMessage'

// types
import type {
  ForwardRefRenderFunction,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from 'react'

type Props = {
  label: string
  name: string
  error?: string
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<boolean | void>
  imageFileURL: string
  setImageFileURL: Dispatch<SetStateAction<string>>
}

const FileUploadInputBase: ForwardRefRenderFunction<HTMLInputElement, Props> = (
  { label, name, error, onChange, imageFileURL, setImageFileURL, ...rest },
  ref
) => {
  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    // this line is necessary because as react hook form owns the onChange method, in order to use our own
    // onChange method, we need to call react-hook-form onChange as well
    await onChange(event)

    // thought we have a validation for file size using YUP, that validation only display the error message;
    // the below validation ensures that images bigger than 10 MB aren't displayed in the image preview
    if (
      !event.target.files?.length ||
      event.target.files[0].size > 10_485_760
    ) {
      return
    }

    const image = event.target.files[0]

    const imageUrl = URL.createObjectURL(image)
    setImageFileURL(imageUrl)
  }

  return (
    <Box
      onKeyDown={({ key }) =>
        key === 'Enter' &&
        document.querySelector<HTMLInputElement>('#image')?.click()
      }
    >
      <FormLabel htmlFor={name} d='flex' flexDirection='column'>
        <Text as='span'>{label}</Text>

        {imageFileURL ? (
          <Image
            src={imageFileURL}
            alt='Imagem enviada pelo usuário.'
            cursor='pointer'
            borderRadius='md'
            transition='100ms'
            objectFit='fill'
            tabIndex={0}
            _hover={{
              bg: 'white',
              borderColor: 'light.300',
              borderWidth: '1px',
              boxShadow: `0 0 0 3px #fea`,
            }}
            _focus={{
              outline: 'none',
              bg: 'white',
              borderColor: 'light.300',
              borderWidth: '1px',
              boxShadow: `0 0 0 3px #fea`,
            }}
          />
        ) : (
          <Center
            h='200px'
            bg='light.100'
            d='flex'
            align='center'
            justify='center'
            borderRadius='md'
            tabIndex={0}
            cursor='pointer'
            transition='100ms'
            _hover={{
              bg: 'white',
              borderColor: 'light.300',
              borderWidth: '1px',
              boxShadow: `0 0 0 3px #fea`,
            }}
            _focus={{
              outline: 'none',
              bg: 'white',
              borderColor: 'light.300',
              borderWidth: '1px',
              boxShadow: `0 0 0 3px #fea`,
            }}
          >
            <MdOutlineFileUpload size='70px' />
          </Center>
        )}

        <input
          id={name}
          name={name}
          ref={ref}
          type='file'
          style={{
            position: 'absolute',
            height: '1px',
            width: '1px',
            overflow: 'hidden',
            clip: 'rect(1px, 1px, 1px, 1px)',
          }}
          aria-hidden='true'
          tabIndex={-1} // prevent input from receiving focus on tabbing
          accept='image/png, image/jpeg'
          onChange={handleImageUpload}
          {...rest}
        />
      </FormLabel>

      {error && <ErrorMessage message={error} />}
    </Box>
  )
}

const FileUploadInput = forwardRef(FileUploadInputBase)

export { FileUploadInput }
