import { Box, Heading, Text, Button } from '@chakra-ui/react'
import Link from 'next/link'

function SignUpCallToAction() {
  return (
    <Box mt={10}>
      <Heading as='h2' variant='outline'>
        Cadastre-se
      </Heading>

      <Text my={5}>Ainda não possui conta? Cadastre-se no site.</Text>

      <Link href='/signup' passHref>
        <Button as='a'>Cadastrar</Button>
      </Link>
    </Box>
  )
}

export { SignUpCallToAction }
