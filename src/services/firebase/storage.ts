import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { app } from '.'

// types
import type { FirebaseStorage } from 'firebase/storage'

let storage: FirebaseStorage

if (typeof window !== 'undefined' && location.hostname === 'localhost') {
  storage = getStorage()
  connectStorageEmulator(storage, 'localhost', 9199)
} else {
  storage = getStorage(app)
}

export { storage }
