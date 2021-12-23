import { getDatabase, connectDatabaseEmulator } from 'firebase/database'
import { app } from '.'

// types
import type { Database } from 'firebase/database'

let db: Database

if (typeof window !== 'undefined' && location.hostname === 'localhost') {
  db = getDatabase()
  connectDatabaseEmulator(db, 'localhost', 9000)
} else {
  db = getDatabase(app)
}

export { db }
