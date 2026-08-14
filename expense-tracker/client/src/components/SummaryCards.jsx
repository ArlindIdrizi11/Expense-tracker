import { money, meta } from '../categories.js'

function Card({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
  )
}

export default function SummaryCards({ summary }) {
  const top = summary.byCategory?.[0]
  const avg = summary.count ? summary.total / summary.count : 0

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card label="Total spent" value={money(summary.total)} sub={`${summary.count} expenses`} />
      <Card label="Average expense" value={money(avg)} sub="per entry" />
      <Card
        label="Top category"
        value={top ? `${meta(top.category).icon} ${top.category}` : '—'}
        sub={top ? money(top.total) : 'no data yet'}
      />
    </div>
  )
}
