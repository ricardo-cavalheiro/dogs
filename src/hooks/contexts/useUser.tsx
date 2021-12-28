import { useState, useEffect, createContext, useContext } from 'react'
import { onAuthStateChanged, signOut, onIdTokenChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import { setCookie, destroyCookie } from 'nookies'

// hooks
import { useHandleError } from '../useHandleError'

// firebase services
import { auth } from '../../services/firebase/auth'

// types
import type { FirebaseError } from 'firebase/app'
import type { UserInfo } from '../../typings/userInfo'
import type { NextOrObserver, User } from 'firebase/auth'
import type { ReactNode, Dispatch, SetStateAction } from 'react'

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
  // states
  const [userInfo, setUserInfo] = useState<UserInfo>({
    uid: '',
    email: '',
    username: '',
    isLoggedIn: false,
    isAccountVerified: false,
  })
  // used to display the loading state/Spinner component at the Header
  const [fetchingUserInfoFirebase, setFetchingUserInfoFirebase] = useState(true)

  // hooks
  const router = useRouter()
  const { handleError } = useHandleError()

  async function signUserOut() {
    try {
      await signOut(auth)

      setUserInfo({
        uid: '',
        email: '',
        username: '',
        isLoggedIn: false,
        isAccountVerified: false,
      })

      destroyCookie(null, '@dogs:token')

      router.push('/login')
    } catch (err) {
      const error = err as FirebaseError

      handleError({ error })
    }
  }

  // auto login
  useEffect(() => {
    const onChange: NextOrObserver<User> = (user) => {
      if (user?.email && user?.displayName) {
        const { email, displayName: username, uid } = user

        setUserInfo({
          uid,
          email,
          username,
          isLoggedIn: true,
          isAccountVerified: user.emailVerified,
        })
        setFetchingUserInfoFirebase(false)

        return
      }

      setUserInfo({
        uid: '',
        email: '',
        username: '',
        isLoggedIn: false,
        isAccountVerified: false,
      })
      setFetchingUserInfoFirebase(false)
    }

    const unsubscribe = onAuthStateChanged(auth, onChange)

    return () => unsubscribe()
  }, [])

  // set the user token to a cookie
  // it is used to prevent (via server-side) the user accessing the login/signup page
  // when they're already logged in
  useEffect(() => {
    const onChange: NextOrObserver<User> = async (user) => {
      if (!user) {
        setCookie(null, '@dogs:token', '', { path: '/' })
      } else {
        try {
          const token = await user.getIdToken()

          setCookie(null, '@dogs:token', token, { path: '/', maxAge: 60 * 60 })
        } catch (err) {
          const error = err as FirebaseError

          handleError({ error })
        }
      }
    }

    const unsubscribe = onIdTokenChanged(auth, onChange)

    return () => unsubscribe()
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
