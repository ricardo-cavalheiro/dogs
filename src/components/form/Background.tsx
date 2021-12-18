import Image from 'next/image'

function Background() {
  return (
    <Image
      src='/login.jpg'
      alt='Imagem ilustrativa.'
      layout='fill'
      objectFit='cover'
      priority
    />
  )
}

export { Background }
