type UserInfo = {
  username: string
  email: string
}

type ImageInfo = {
  id: string
  title: string
  description: string
  author_username: string
  likes: number
  views: number
  path: string
  created_at: string
}

type Comment = {
  id: string
  comment: string
  author_username: string
  likes: number
}

export type { UserInfo, ImageInfo, Comment }