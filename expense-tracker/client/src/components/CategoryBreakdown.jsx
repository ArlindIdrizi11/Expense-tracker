import { money, meta } from '../categories.js'

export default function CategoryBreakdown({ summary }) {
  const rows = summary.byCategory || []
  const max = rows.reduce((m, r) => Math.max(m, r.total), 0) || 1

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold text-slate-900">Spending by category</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-slate-400">No expenses yet.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => {
            const m = meta(r.category)
            const pct = (r.total / max) * 100
            const share = summary.total ? (r.total / summary.total) * 100 : 0
            return (
              <li key={r.category}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    {m.icon} {r.category}
                  </span>
                  <span className="tabular-nums text-slate-500">
                    {money(r.total)} · {share.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: m.color }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
