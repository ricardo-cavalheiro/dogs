import { Box } from '@chakra-ui/react'

// hooks
import { useUser } from '../../hooks/useUser'

function Recovery() {
  // hooks
  const { userInfo } = useUser()

  return <Box>recovery page</Box>
}

export default Recovery
