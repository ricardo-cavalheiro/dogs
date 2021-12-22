import { initializeApp, applicationDefault, getApps, cert } from 'firebase-admin/app'

// types
import type { App } from 'firebase-admin/app'

let adminApp: App

// need to be sure that only one instance is active, otherwise
// `ReferenceError: Cannot access 'adminApp' before initialization` is thrown
if (getApps().length === 0) {
  adminApp = initializeApp({
    credential: cert({
      clientEmail: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
      privateKey: process.env.SERVICE_ACCOUNT_PRIVATE_KEY,
      projectId: process.env.SERVICE_ACCOUNT_PROJECT_ID
    }),
    databaseURL: 'https://dogs-ffe57-default-rtdb.firebaseio.com',
    databaseAuthVariableOverride: {
      uid: 'nodejs-backend',
    },
  })
}

export { adminApp }
