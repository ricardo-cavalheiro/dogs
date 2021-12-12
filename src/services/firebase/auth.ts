import { getAuth,  } from 'firebase/auth'
import { app } from '.'

const auth = getAuth(app)
auth.useDeviceLanguage()

export { auth }
