import { forwardRef } from 'react'
import { Box, FormLabel, Input as CInput } from '@chakra-ui/react'

// components
import { ErrorMessage } from '../ErrorMessage'

// types
import type { InputProps } from '@chakra-ui/react'
import type { ForwardRefRenderFunction } from 'react'

type Props = {
  label: string
  error?: string
} & InputProps

const InputBase: ForwardRefRenderFunction<HTMLInputElement, Props> = (
  { label, error, ...rest },
  ref
) => {
  return (
    <Box mt={2.5} w='100%'>
      <FormLabel htmlFor={rest.name}>{label}</FormLabel>
      <CInput id={rest.name} name={rest.name} {...rest} ref={ref} />

      {error && <ErrorMessage message={error} />}
    </Box>
  )
}

const Input = forwardRef(InputBase)

export { Input }
