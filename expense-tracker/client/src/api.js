// Thin API client. In dev, '/api' is proxied to the Express server (see
// vite.config.js). In production, set VITE_API_URL to your API's base URL.
const BASE = import.meta.env.VITE_API_URL || '/api'

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (res.status === 204) return null
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = data.errors ? data.errors.join(', ') : data.error || 'Request failed'
    throw new Error(msg)
  }
  return data
}

export const getCategories = () => request('/categories')
export const getExpenses = (category) =>
  request(`/expenses${category ? `?category=${encodeURIComponent(category)}` : ''}`)
export const getSummary = () => request('/summary')
export const createExpense = (expense) =>
  request('/expenses', { method: 'POST', body: JSON.stringify(expense) })
export const deleteExpense = (id) => request(`/expenses/${id}`, { method: 'DELETE' })
