import {
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Link,
  Box,
  useColorMode,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import {
  MdOutlineMenu,
  MdOutlineSpaceDashboard,
  MdOutlineTrendingUp,
  MdOutlineAdd,
  MdOutlineLogout,
} from 'react-icons/md'
import { AiOutlineUser } from 'react-icons/ai'
import NextLink from 'next/link'

// hooks
import { useUser } from '../../../hooks/contexts/useUser'

// types
import type { ReactElement } from 'react'

type HeaderMenuItemProps = {
  href: string
  label: string
  icon: ReactElement
  onClick?: () => unknown
}

function HeaderMenuItem({ href, label, icon, onClick }: HeaderMenuItemProps) {
  return (
    <NextLink href={href} passHref>
      <Link variant='none'>
        <MenuItem icon={icon} _hover={{ bg: 'none' }} onClick={onClick}>
          {label}
        </MenuItem>
      </Link>
    </NextLink>
  )
}

function Header() {
  // hooks
  const { asPath } = useRouter()
  const { colorMode } = useColorMode()
  const { userInfo, signUserOut } = useUser()

  type RoutePaths =
    | '/account'
    | '/account/stats'
    | '/account/post'
    | '/account/myphotos'

  const mapPageTitleToRoutePath = {
    get header() {
      switch (asPath as RoutePaths) {
        case '/account/myphotos':
          return 'Minhas fotos'
        case '/account/stats':
          return 'Estatísticas'
        case '/account/post':
          return 'Postar Foto'
        default:
          return 'Minha Conta'
      }
    },
  }

  return (
    <Flex
      mx='auto'
      maxW='768px'
      as='header'
      align='center'
      justify='space-between'
      mb={5}
      flexWrap='wrap'
      columnGap={5}
    >
      <Heading flexBasis='50%'>{mapPageTitleToRoutePath.header}</Heading>

      <Flex as='nav' zIndex={3}>
        <Menu>
          <>
            <Box
              bgColor={colorMode == 'light' ? 'light.100' : 'dark.900'}
              borderRadius='sm'
            >
              <MenuButton
                as={IconButton}
                variant='iconButton'
                aria-label='Abrir menu'
                icon={
                  <MdOutlineMenu
                    size={45}
                    color={`${colorMode === 'light' ? '#333' : '#fff'}`}
                  />
                }
              >
                Button
              </MenuButton>
            </Box>

            <MenuList>
              <HeaderMenuItem
                href={`/account/${userInfo.username}`}
                label='Minha Conta'
                icon={
                  <AiOutlineUser
                    size={30}
                    color={`${colorMode === 'light' ? '#333' : '#fff'}`}
                  />
                }
              />

              <HeaderMenuItem
                href={'/account/myphotos'}
                label='Minhas Fotos'
                icon={
                  <MdOutlineSpaceDashboard
                    size={30}
                    color={`${colorMode === 'light' ? '#333' : '#fff'}`}
                  />
                }
              />

              <HeaderMenuItem
                href='/account/stats'
                label='Estatísticas'
                icon={
                  <MdOutlineTrendingUp
                    size={30}
                    color={`${colorMode === 'light' ? '#333' : '#fff'}`}
                  />
                }
              />

              <HeaderMenuItem
                href='/account/post'
                label='Postar Foto'
                icon={
                  <MdOutlineAdd
                    size={30}
                    color={`${colorMode === 'light' ? '#333' : '#fff'}`}
                  />
                }
              />

              <MenuItem
                icon={
                  <MdOutlineLogout
                    size={30}
                    color={`${colorMode === 'light' ? '#333' : '#fff'}`}
                  />
                }
                _hover={{ bg: 'none' }}
                onClick={signUserOut}
              >
                Sair
              </MenuItem>
            </MenuList>
          </>
        </Menu>
      </Flex>
    </Flex>
  )
}

export { Header }
