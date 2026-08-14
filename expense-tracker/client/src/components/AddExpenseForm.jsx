import { useState } from 'react'

const today = () => new Date().toISOString().slice(0, 10)

const emptyForm = (categories) => ({
  description: '',
  amount: '',
  category: categories[0] || 'Food',
  date: today(),
})

const input =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'

export default function AddExpenseForm({ categories, onAdd }) {
  const [form, setForm] = useState(emptyForm(categories))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.description.trim()) return setError('Add a short description.')
    if (!(Number(form.amount) >= 0) || form.amount === '') return setError('Enter a valid amount.')

    setSaving(true)
    try {
      await onAdd({
        description: form.description.trim(),
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
      })
      setForm(emptyForm(categories))
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold text-slate-900">Add expense</h2>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Description</label>
          <input
            className={input}
            placeholder="e.g. Groceries"
            value={form.description}
            onChange={set('description')}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Amount</label>
            <input
              className={input}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={set('amount')}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Date</label>
            <input className={input} type="date" value={form.date} onChange={set('date')} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Category</label>
          <select className={input} value={form.category} onChange={set('category')}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {saving ? 'Adding…' : 'Add expense'}
        </button>
      </div>
    </form>
  )
}
