import { useRouter } from 'next/router'

function Photo() {
  const router = useRouter()

  return <p>after redirect {router.asPath}</p>
}

export default Photo
