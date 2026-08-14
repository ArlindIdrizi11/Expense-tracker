import { useEffect, useState, useCallback } from 'react'
import SummaryCards from './components/SummaryCards.jsx'
import CategoryBreakdown from './components/CategoryBreakdown.jsx'
import AddExpenseForm from './components/AddExpenseForm.jsx'
import ExpenseList from './components/ExpenseList.jsx'
import * as api from './api.js'

export default function App() {
  const [categories, setCategories] = useState(['Food'])
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState({ total: 0, count: 0, byCategory: [] })
  const [filter, setFilter] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async (activeFilter = filter) => {
    try {
      const [exp, sum] = await Promise.all([api.getExpenses(activeFilter), api.getSummary()])
      setExpenses(exp)
      setSummary(sum)
      setError('')
    } catch (err) {
      setError('Server not found')
    }
  }, [filter])

  // Initial load: categories + data.
  useEffect(() => {
    ;(async () => {
      try {
        const cats = await api.getCategories()
        setCategories(cats)
      } catch {
        /* handled by refresh error */
      }
      await refresh('')
      setLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onFilter = async (value) => {
    setFilter(value)
    await refresh(value)
  }

  const onAdd = async (expense) => {
    await api.createExpense(expense)
    await refresh()
  }

  const onDelete = async (id) => {
    await api.deleteExpense(id)
    await refresh()
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-lg font-extrabold text-white">
            $
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight">Expense Tracker</h1>
            <p className="text-xs text-slate-500">React · Express · SQLite</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {error && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        {loading ? (
          <p className="py-20 text-center text-sm text-slate-400">Loading…</p>
        ) : (
          <div className="space-y-6">
            <SummaryCards summary={summary} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
              <div className="space-y-6">
                <AddExpenseForm categories={categories} onAdd={onAdd} />
                <CategoryBreakdown summary={summary} />
              </div>

              <ExpenseList
                expenses={expenses}
                categories={categories}
                filter={filter}
                onFilter={onFilter}
                onDelete={onDelete}
              />
            </div>
          </div>
        )}

        <footer className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          A simple full-stack CRUD app — React frontend, Express REST API, SQLite storage.
        </footer>
      </main>
    </div>
  )
}
