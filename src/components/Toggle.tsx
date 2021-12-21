import { useState } from 'react'
import { Box, useColorMode } from '@chakra-ui/react'

function Toggle() {
  // hooks
  const { colorMode, toggleColorMode } = useColorMode()

  // states
  const [pinProps, setPinProps] = useState({
    active: colorMode === 'light' ? true : false,
    position: colorMode === 'light' ? '33px' : '-3px',
  })

  function toggle() {
    setPinProps({
      active: !pinProps.active,
      position: pinProps.active ? '-3px' : '33px',
    })

    toggleColorMode()
  }

  return (
    <Box
      h='30px'
      w='60px'
      cursor='pointer'
      onClick={toggle}
      borderRadius='full'
      bgColor={pinProps.active ? 'light.200' : '#a8a8a8'}
    >
      <Box
        h='30px'
        w='30px'
        borderRadius='full'
        transition=' 200ms linear'
        bgColor={pinProps.active ? 'light.300' : 'light.800'}
        transform={`translateX(${pinProps.position})`}
      />
    </Box>
  )
}

export { Toggle }
