import { motion } from 'framer-motion'

type DogsIconProps = {
  color?: string
}

const DogsIcon = ({ color }: DogsIconProps) => {
  return (
    <svg
      width='28'
      height='22'
      viewBox='0 0 28 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M14 10h1.652c1.708 0 2.63 2.004 1.518 3.302l-1.618 1.887A4.501 4.501 0 0024.5 14.5a1.5 1.5 0 013 0A7.5 7.5 0 0114 19 7.5 7.5 0 01.5 14.5a1.5 1.5 0 013 0 4.5 4.5 0 008.948.689l-1.618-1.887C9.718 12.004 10.64 10 12.35 10H14z'
        fill={color || '#333'}
      />
      <circle cx='21' cy='3' r='3' fill={color || '#333'} />
      <circle cx='7' cy='3' r='3' fill={color || '#333'} />
    </svg>
  )
}

const UserIcon = () => {
  return (
    <svg
      width='14'
      height='17'
      viewBox='0 0 14 17'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M7 6C8.10457 6 9 5.10457 9 4C9 2.89543 8.10457 2 7 2C5.89543 2 5 2.89543 5 4C5 5.10457 5.89543 6 7 6ZM7 8C9.20914 8 11 6.20914 11 4C11 1.79086 9.20914 0 7 0C4.79086 0 3 1.79086 3 4C3 6.20914 4.79086 8 7 8Z'
        fill='#333'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M7 11C4.23858 11 2 13.2386 2 16C2 16.5523 1.55228 17 1 17C0.447715 17 0 16.5523 0 16C0 12.134 3.13401 9 7 9C10.866 9 14 12.134 14 16C14 16.5523 13.5523 17 13 17C12.4477 17 12 16.5523 12 16C12 13.2386 9.76142 11 7 11Z'
        fill='#333'
      />
    </svg>
  )
}

const HamburgerMenuIcon = () => {
  return (
    <svg
      width='40'
      height='23'
      viewBox='0 0 40 23'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect width='40' height='3' rx='2' fill='#333333' />
      <rect y='9.09091' width='40' height='3' rx='2' fill='#333333' />
      <rect y='18.1818' width='40' height='3' rx='2' fill='#333333' />
    </svg>
  )
}

const NewItemIcon = () => {
  return (
    <svg width={28} height={28} fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M14 5a1 1 0 0 1 1 1v7h7a1 1 0 1 1 0 2h-7v7a1 1 0 1 1-2 0v-7H6a1 1 0 1 1 0-2h7V6a1 1 0 0 1 1-1z'
        fill='#333'
      />
    </svg>
  )
}

const FeedIcon = () => {
  return (
    <svg width={28} height={28} fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M7 4h3a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zm0 2a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H7zm0 9h3a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-3a3 3 0 0 1 3-3zm0 2a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H7zM18 4h3a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zm0 2a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-3zm0 9h3a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3v-3a3 3 0 0 1 3-3zm0 2a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-3z'
        fill='#333'
      />
    </svg>
  )
}

const StatisticsIcon = () => {
  return (
    <svg width={28} height={28} fill='none' xmlns='http://www.w3.org/2000/svg'>
      <rect x={6} y={14} width={2} height={8} rx={1} fill='#333' />
      <rect x={13} y={10} width={2} height={12} rx={1} fill='#333' />
      <rect x={20} y={6} width={2} height={16} rx={1} fill='#333' />
    </svg>
  )
}

const LogOutIcon = () => {
  return (
    <svg width={28} height={28} fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M19.293 9.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L21.586 15H12a1 1 0 1 1 0-2h9.586l-2.293-2.293a1 1 0 0 1 0-1.414Z'
        fill='#333'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M5 6a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V7H7v14h7v-3a1 1 0 1 1 2 0v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6Z'
        fill='#333'
      />
    </svg>
  )
}

export {
  DogsIcon,
  UserIcon,
  HamburgerMenuIcon,
  NewItemIcon,
  FeedIcon,
  StatisticsIcon,
  LogOutIcon,
}
