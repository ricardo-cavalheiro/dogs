import { getDatabase } from 'firebase/database'
import { app } from '.'

const db = getDatabase(app)

export { db }
