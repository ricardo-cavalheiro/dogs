import { Flex, Text } from '@chakra-ui/react'

// components
import { Toggle } from '../../components/Toggle'
import { DeleteAccount } from '../../components/pages/account/DeleteAccount'

// layout
import { UserHeader } from '../../components/layout/UserHeader'

function MyPhotos() {
  return (
    <Flex maxW='768px' mx='auto' direction='column' rowGap={5}>
      <Flex align='center' justify='space-between'>
        <Text>Mudar tema</Text>

        <Toggle />
      </Flex>

      <DeleteAccount />
    </Flex>
  )
}

MyPhotos.UserHeader = UserHeader

export default MyPhotos
