import { getDatabase, connectDatabaseEmulator } from 'firebase/database'
import { app } from './app'

// types
import type { Database } from 'firebase/database'

const ENV = process.env.NODE_ENV
let db: Database

switch (ENV) {
  case 'production':
    db = getDatabase(app)

    break
  default:
    db = getDatabase()
    connectDatabaseEmulator(db, 'localhost', 9000)
    
    break
}

export { db }
