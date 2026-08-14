import { money, meta } from '../categories.js'

const fmtDate = (iso) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

export default function ExpenseList({ expenses, categories, filter, onFilter, onDelete }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
        <h2 className="text-sm font-bold text-slate-900">
          Expenses <span className="text-slate-400">({expenses.length})</span>
        </h2>
        <select
          value={filter}
          onChange={(e) => onFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-emerald-500"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {expenses.length === 0 ? (
        <p className="p-8 text-center text-sm text-slate-400">
          No expenses{filter ? ` in ${filter}` : ''} yet. Add one on the left.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {expenses.map((e) => {
            const m = meta(e.category)
            return (
              <li key={e.id} className="group flex items-center gap-3 px-5 py-3 hover:bg-slate-50">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg"
                  style={{ backgroundColor: `${m.color}1a` }}
                >
                  {m.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{e.description}</p>
                  <p className="text-xs text-slate-400">
                    {e.category} · {fmtDate(e.date)}
                  </p>
                </div>
                <span className="tabular-nums text-sm font-semibold text-slate-900">
                  {money(e.amount)}
                </span>
                <button
                  onClick={() => onDelete(e.id)}
                  aria-label="Delete expense"
                  className="ml-1 rounded-md p-1.5 text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M10 11v6M14 11v6" />
                  </svg>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
