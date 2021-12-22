import { Box } from '@chakra-ui/react'
import Head from 'next/head'

// layout
import { UserHeader } from '../../components/layout/UserHeader'

function Stats() {
  return (
    <>
      <Head>
        <title>Dogs | Estatísticas</title>
      </Head>

      <Box>stats page</Box>
    </>
  )
}

Stats.UserHeader = UserHeader

export default Stats
