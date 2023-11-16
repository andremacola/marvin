import Database from 'better-sqlite3'

const db = new Database('marvin.db', { verbose: console.log })
db.pragma('journal_mode = WAL')

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    number INTEGER,
    name TEXT,
    credits_total INTEGER,
    credits_used INTEGER,
    credits_remaining INTEGER,
    last_interaction INTEGER,
    game_victories INTEGER
  )
`)
