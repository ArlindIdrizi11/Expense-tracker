import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Single-file SQLite database (Node's built-in driver — no native deps),
// created next to the server on first run.
const db = new DatabaseSync(join(__dirname, 'expenses.db'))
db.exec('PRAGMA journal_mode = WAL;')

// The allowed categories — kept in one place so the API and UI agree.
export const CATEGORIES = [
  'Food',
  'Transport',
  'Housing',
  'Utilities',
  'Entertainment',
  'Health',
  'Shopping',
  'Other',
]

db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT    NOT NULL,
    amount      REAL    NOT NULL CHECK (amount >= 0),
    category    TEXT    NOT NULL,
    date        TEXT    NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`)

// Seed a handful of rows the first time so the app isn't empty on launch.
const { n } = db.prepare('SELECT COUNT(*) AS n FROM expenses').get()
if (n === 0) {
  const today = new Date()
  const d = (daysAgo) => {
    const t = new Date(today)
    t.setDate(t.getDate() - daysAgo)
    return t.toISOString().slice(0, 10)
  }
  const seed = db.prepare(
    'INSERT INTO expenses (description, amount, category, date) VALUES (?, ?, ?, ?)',
  )
  const rows = [
    ['Groceries', 54.2, 'Food', d(1)],
    ['Bus pass', 30.0, 'Transport', d(2)],
    ['Coffee with a friend', 8.75, 'Food', d(2)],
    ['Electricity bill', 62.4, 'Utilities', d(4)],
    ['Movie tickets', 24.0, 'Entertainment', d(5)],
    ['Pharmacy', 18.9, 'Health', d(6)],
    ['New headphones', 89.99, 'Shopping', d(9)],
    ['Rent', 700.0, 'Housing', d(12)],
  ]
  db.exec('BEGIN;')
  for (const r of rows) seed.run(...r)
  db.exec('COMMIT;')
}

export default db
