import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'next/router'

// firebase
import { auth } from '../services/firebase/auth'

// types
import type { ReactNode, Dispatch, SetStateAction } from 'react'
import type { UserInfo } from '../typings/userInfo'
import type { User } from 'firebase/auth'

type UserContextType = {
  userInfo: UserInfo
  setUserInfo: Dispatch<SetStateAction<UserInfo>>
  fetchingUserInfoFirebase: boolean
  signUserOut: () => Promise<void>
}

const UserContext = createContext<UserContextType>({} as UserContextType)

type Props = {
  children: ReactNode
}

function UserContextProvider({ children }: Props) {
  const [userInfo, setUserInfo] = useState({} as UserInfo)
  // used to display the loading state/Spinner component at the Header
  const [fetchingUserInfoFirebase, setFetchingUserInfoFirebase] = useState(true)

  // hooks
  const router = useRouter()

  const autoLogin = useCallback(() => {
    const onChange = (user: User | null) => {
      if (user?.email && user?.displayName) {
        const { email, displayName: username } = user

        setUserInfo({ email, username, isLoggedIn: true })
        setFetchingUserInfoFirebase(false)

        return
      }

      setUserInfo({ email: '', username: '', isLoggedIn: false })
      setFetchingUserInfoFirebase(false)
      router.push('/login')
    }

    const onError = () => {}
    const onCompleted = () => {}

    onAuthStateChanged(auth, onChange, onError, onCompleted)
  }, [])

  async function signUserOut() {
    try {
      setUserInfo({ email: '', username: '', isLoggedIn: false })

      await signOut(auth)
    } catch (err) {
      console.log({ err })
    }
  }

  useEffect(() => {
    autoLogin()
  }, [])

  return (
    <UserContext.Provider
      value={{ userInfo, setUserInfo, fetchingUserInfoFirebase, signUserOut }}
    >
      {children}
    </UserContext.Provider>
  )
}

const useUser = () => useContext(UserContext)

export { UserContextProvider, useUser }
