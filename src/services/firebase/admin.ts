import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app'

// types
import type { App } from 'firebase-admin/app'

let adminApp: App

// need to be sure that only one instance is active, otherwise
// `ReferenceError: Cannot access 'adminApp' before initialization` is thrown
if (getApps().length === 0) {
  adminApp = initializeApp({
    credential: applicationDefault(),
    databaseURL: 'https://dogs-ffe57-default-rtdb.firebaseio.com',
  })
}

export { adminApp }
