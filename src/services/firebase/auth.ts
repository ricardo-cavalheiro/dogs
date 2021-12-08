import { getAuth } from 'firebase/auth'
import { app } from '.'

const auth = getAuth(app)

export { auth }
