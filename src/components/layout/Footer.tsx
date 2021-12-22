import { Flex, Text } from '@chakra-ui/react'

// components
import { DogsIcon } from '../MyIcons'

function Footer() {
  return (
    <Flex
      as='footer'
      h='70px'
      w='100%'
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
