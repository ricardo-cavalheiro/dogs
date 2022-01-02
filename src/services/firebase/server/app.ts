import { initializeApp, getApps, cert } from 'firebase-admin/app'

// types
import type { App } from 'firebase-admin/app'

const ENV = process.env.NODE_ENV
let app: App

// need to be sure that only one instance is active, otherwise
// `ReferenceError: Cannot access 'app' before initialization` is thrown
if (getApps().length === 0) {
  switch (ENV) {
    case 'production':
      app = initializeApp({
        credential: cert({
          clientEmail: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
          privateKey: process.env.SERVICE_ACCOUNT_PRIVATE_KEY,
          projectId: process.env.SERVICE_ACCOUNT_PROJECT_ID,
        }),
        databaseURL: 'https://dogs-ffe57-default-rtdb.firebaseio.com',
        databaseAuthVariableOverride: {
          uid: 'nodejs-backend',
        },
      })

      break
    default:
      app = initializeApp({
        projectId: 'dogs-ffe57',
        databaseURL: 'http://localhost:9000/?ns=dogs-ffe57-default-rtdb',
        databaseAuthVariableOverride: {
          uid: 'nodejs-backend',
        },
      })

      break
  }
}

export { app }
