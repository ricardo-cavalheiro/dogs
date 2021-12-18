import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

// types
import type { ReactElement } from 'react'

type Props = {
  children: ReactElement
  container: string
}

function Portal({ children, container }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    return () => setMounted(false)
  }, [])

  return mounted
    ? createPortal(children, document.querySelector(container)!)
    : null
}

export { Portal }
