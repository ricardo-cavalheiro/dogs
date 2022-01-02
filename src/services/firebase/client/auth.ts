import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { app } from './app'

// types
import type { Auth } from 'firebase/auth'

const ENV = process.env.NODE_ENV
let auth: Auth

switch (ENV) {
  case 'production':
    auth = getAuth(app)
    auth.useDeviceLanguage()

    break
  default:
    auth = getAuth()
    auth.useDeviceLanguage()
    connectAuthEmulator(auth, 'http://localhost:9099')

    break
}

export { auth }
