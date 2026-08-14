// Visual metadata for each category — icon + accent color for chips and bars.
export const CATEGORY_META = {
  Food: { icon: '🍔', color: '#f59e0b' },
  Transport: { icon: '🚌', color: '#3b82f6' },
  Housing: { icon: '🏠', color: '#8b5cf6' },
  Utilities: { icon: '💡', color: '#14b8a6' },
  Entertainment: { icon: '🎬', color: '#ec4899' },
  Health: { icon: '💊', color: '#ef4444' },
  Shopping: { icon: '🛍️', color: '#6366f1' },
  Other: { icon: '📦', color: '#64748b' },
}

export const meta = (category) => CATEGORY_META[category] || CATEGORY_META.Other

export const money = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n) || 0)
