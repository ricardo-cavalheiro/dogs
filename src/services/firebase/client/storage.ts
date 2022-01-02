import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { app } from './app'

// types
import type { FirebaseStorage } from 'firebase/storage'

const ENV = process.env.NODE_ENV
let storage: FirebaseStorage

switch (ENV) {
  case 'production':
    storage = getStorage(app)

    break
  default:
    storage = getStorage()
    connectStorageEmulator(storage, 'localhost', 9199)

    break
}

export { storage }
