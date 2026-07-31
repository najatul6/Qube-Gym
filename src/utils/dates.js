// Date helpers for the qube-gym schedule system.

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

/** Convert a short day name (Mon..Sun) to the next occurring YYYY-MM-DD. */
export function nextDateForDay(dayName, from = new Date()) {
  const idx = DAYS.indexOf(dayName)
  if (idx === -1) return from.toISOString().slice(0, 10)
  const curIdx = (from.getDay() + 6) % 7 // make Monday = 0
  let add = (idx - curIdx + 7) % 7
  if (add === 0) add = 7 // next occurrence, not today
  const d = new Date(from)
  d.setDate(d.getDate() + add)
  return d.toISOString().slice(0, 10)
}

/** Pretty-print a YYYY-MM-DD date. */
export function formatDate(dateStr, opts = {}) {
  try {
    const d = new Date(dateStr + "T00:00:00")
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      ...opts,
    })
  } catch {
    return dateStr
  }
}

/** Days until a YYYY-MM-DD date (negative if past). */
export function daysUntil(dateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr + "T00:00:00")
  return Math.round((target - today) / 86400000)
}

/** Relative label like "Today", "Tomorrow", "in 3 days". */
export function relativeDay(dateStr) {
  const n = daysUntil(dateStr)
  if (n < 0) return `${Math.abs(n)}d ago`
  if (n === 0) return "Today"
  if (n === 1) return "Tomorrow"
  return `in ${n} days`
}