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
import NextLink from 'next/link'

// components
import {
  HamburgerMenuIcon,
  NewItemIcon,
  FeedIcon,
  LogOutIcon,
  StatisticsIcon,
} from '../../icons'

// hooks
import { useUser } from '../../../hooks/useUser'

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
  const { signUserOut } = useUser()

  type RoutePaths = '/account' | '/account/stats' | '/account/post'

  const mapPageTitleToRoutePath = {
    get header() {
      switch (asPath as RoutePaths) {
        case '/account':
          return 'Minha Conta'
        case '/account/stats':
          return 'Estatísticas'
        case '/account/post':
          return 'Postar Foto'
      }
    },
  }

  return (
    <Flex as='header' align='center' justify='space-between'>
      <Heading>{mapPageTitleToRoutePath.header}</Heading>

      <Flex as='nav' zIndex={3}>
        <Menu>
          <>
            <MenuButton
              as={IconButton}
              variant='iconButton'
              aria-label='Abrir menu'
              icon={<HamburgerMenuIcon />}
            >
              Button
            </MenuButton>

            <MenuList>
              <HeaderMenuItem
                href='/account'
                label='Minhas Fotos'
                icon={<FeedIcon />}
              />

              <HeaderMenuItem
                href='/account/stats'
                label='Estatísticas'
                icon={<StatisticsIcon />}
              />

              <HeaderMenuItem
                href='/account/post'
                label='Postar foto'
                icon={<NewItemIcon />}
              />

              <MenuItem
                icon={<LogOutIcon />}
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
