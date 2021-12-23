import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { app } from '.'

// types
import type { Auth } from 'firebase/auth'

let auth: Auth

if (typeof window !== 'undefined' && location.hostname === 'localhost') {
  auth = getAuth()
  connectAuthEmulator(auth, 'http://localhost:9099')
} else {
  auth = getAuth(app)
  auth.useDeviceLanguage()
}

export { auth }
