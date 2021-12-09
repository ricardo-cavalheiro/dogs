import { useState, forwardRef } from 'react'
import {
  Box,
  FormLabel,
  InputGroup,
  Input as CInput,
  InputRightElement,
  IconButton as CIconButton,
} from '@chakra-ui/react'
import { MdOutlineVisibility, MdOutlineVisibilityOff } from 'react-icons/md'

// components
import { ErrorMessage } from '../ErrorMessage'

// types
import type { InputProps } from '@chakra-ui/react'
import type { ForwardRefRenderFunction, ReactNode } from 'react'

type IconButtonProps = {
  children: ReactNode
  onClick: () => void
}

function IconButton({ children, onClick }: IconButtonProps) {
  return (
    <CIconButton
      onClick={onClick}
      aria-label='Mostrar senha'
      bg='transparent'
      _hover={{ bg: 'transparent' }}
    >
      {children}
    </CIconButton>
  )
}

type Props = {
  label: string
  error?: string
} & InputProps

const PasswordInputBase: ForwardRefRenderFunction<HTMLInputElement, Props> = (
  { label, error, ...rest },
  ref
) => {
  const [showPassword, setShowPassword] = useState(false)

  function handleClick() {
    setShowPassword(!showPassword)
  }

  return (
    <Box mt={2.5}>
      <FormLabel htmlFor={rest.name}>{label}</FormLabel>
      <InputGroup>
        <CInput
          id={rest.name}
          name={rest.name}
          type={showPassword ? 'text' : 'password'}
          ref={ref}
          {...rest}
        />
        <InputRightElement>
          {showPassword ? (
            <IconButton onClick={handleClick}>
              <MdOutlineVisibilityOff size={30} color='#333' />
            </IconButton>
          ) : (
            <IconButton onClick={handleClick}>
              <MdOutlineVisibility size={30} color='#333' />
            </IconButton>
          )}
        </InputRightElement>
      </InputGroup>

      {error && <ErrorMessage message={error} />}
    </Box>
  )
}

const PasswordInput = forwardRef(PasswordInputBase)

export { PasswordInput }
