import express from 'express'
import cors from 'cors'
import db, { CATEGORIES } from './db.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// --- Prepared statements (compiled once, reused) --------------------------
const stmts = {
  all: db.prepare('SELECT * FROM expenses ORDER BY date DESC, id DESC'),
  byCategory: db.prepare(
    'SELECT * FROM expenses WHERE category = ? ORDER BY date DESC, id DESC',
  ),
  byId: db.prepare('SELECT * FROM expenses WHERE id = ?'),
  insert: db.prepare(
    'INSERT INTO expenses (description, amount, category, date) VALUES (?, ?, ?, ?)',
  ),
  update: db.prepare(
    'UPDATE expenses SET description=?, amount=?, category=?, date=? WHERE id=?',
  ),
  remove: db.prepare('DELETE FROM expenses WHERE id = ?'),
  summary: db.prepare(
    'SELECT category, COUNT(*) AS count, SUM(amount) AS total FROM expenses GROUP BY category ORDER BY total DESC',
  ),
  total: db.prepare('SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) AS count FROM expenses'),
}

// --- Validation helper ----------------------------------------------------
function validate(body) {
  const errors = []
  const description = String(body.description ?? '').trim()
  const amount = Number(body.amount)
  const category = String(body.category ?? '').trim()
  const date = String(body.date ?? '').trim()

  if (!description) errors.push('description is required')
  if (!Number.isFinite(amount) || amount < 0) errors.push('amount must be a number ≥ 0')
  if (!CATEGORIES.includes(category)) errors.push(`category must be one of: ${CATEGORIES.join(', ')}`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push('date must be YYYY-MM-DD')

  return { errors, value: { description, amount, category, date } }
}

// --- Routes ---------------------------------------------------------------
app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.get('/api/categories', (_req, res) => res.json(CATEGORIES))

app.get('/api/expenses', (req, res) => {
  const { category } = req.query
  const rows =
    category && CATEGORIES.includes(category) ? stmts.byCategory.all(category) : stmts.all.all()
  res.json(rows)
})

app.get('/api/summary', (_req, res) => {
  const { total, count } = stmts.total.get()
  res.json({ total, count, byCategory: stmts.summary.all() })
})

app.post('/api/expenses', (req, res) => {
  const { errors, value } = validate(req.body)
  if (errors.length) return res.status(400).json({ errors })
  const info = stmts.insert.run(value.description, value.amount, value.category, value.date)
  res.status(201).json(stmts.byId.get(info.lastInsertRowid))
})

app.put('/api/expenses/:id', (req, res) => {
  const id = Number(req.params.id)
  if (!stmts.byId.get(id)) return res.status(404).json({ error: 'not found' })
  const { errors, value } = validate(req.body)
  if (errors.length) return res.status(400).json({ errors })
  stmts.update.run(value.description, value.amount, value.category, value.date, id)
  res.json(stmts.byId.get(id))
})

app.delete('/api/expenses/:id', (req, res) => {
  const id = Number(req.params.id)
  const info = stmts.remove.run(id)
  if (info.changes === 0) return res.status(404).json({ error: 'not found' })
  res.status(204).end()
})

app.listen(PORT, () => {
  console.log(`Expense API running on http://localhost:${PORT}`)
})
