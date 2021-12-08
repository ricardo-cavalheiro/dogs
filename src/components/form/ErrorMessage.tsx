import { Text } from '@chakra-ui/react'

type Props = {
  message: string
}

function ErrorMessage({ message }: Props) {
  return (
    <Text as='span' color='light.400' d='inline-block' mt={1}>
      {message}
    </Text>
  )
}

export { ErrorMessage }
