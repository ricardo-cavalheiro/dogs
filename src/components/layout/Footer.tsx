import { Flex, Text } from '@chakra-ui/react'

// components
import { DogsIcon } from '../icons'

function Footer() {
  return (
    <Flex
      h='100px'
      bgColor='light.300'
      direction='column'
      align='center'
      justify='space-evenly'
    >
      <DogsIcon color='#764701' />

      <Text color='light.500'>Alguns direitos reservados.</Text>
    </Flex>
  )
}

export { Footer }
