import {
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Link,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import {
  MdOutlineMenu,
  MdOutlineSpaceDashboard,
  MdOutlineTrendingUp,
  MdOutlineAdd,
  MdOutlineLogout,
} from 'react-icons/md'
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
  const { userInfo, signUserOut } = useUser()

  type RoutePaths = '/account' | '/account/stats' | '/account/post'

  const mapPageTitleToRoutePath = {
    get header() {
      switch (asPath as RoutePaths) {
        case '/account/stats':
          return 'Estatísticas'
        case '/account/post':
          return 'Postar Foto'
        default:
          return 'Minhas Fotos'
      }
    },
  }

  return (
    <Flex as='header' align='center' justify='space-between' mb={5}>
      <Heading>{mapPageTitleToRoutePath.header}</Heading>

      <Flex as='nav' zIndex={3}>
        <Menu>
          <>
            <MenuButton
              as={IconButton}
              variant='iconButton'
              aria-label='Abrir menu'
              icon={<MdOutlineMenu size={60} color='#333' />}
            >
              Button
            </MenuButton>

            <MenuList>
              <HeaderMenuItem
                href={`/account/${userInfo.username}`}
                label='Minhas Fotos'
                icon={<MdOutlineSpaceDashboard size={30} color='#333' />}
              />

              <HeaderMenuItem
                href='/account/stats'
                label='Estatísticas'
                icon={<MdOutlineTrendingUp size={30} color='#333' />}
              />

              <HeaderMenuItem
                href='/account/post'
                label='Postar Foto'
                icon={<MdOutlineAdd size={30} color='#333' />}
              />

              <MenuItem
                icon={<MdOutlineLogout size={30} color='#333' />}
                _hover={{ bg: 'none' }}
                onClick={async () => await signUserOut()}
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
