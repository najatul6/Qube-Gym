/**
 * qube-gym — Mock LocalStorage Backend
 * ------------------------------------
 * A central data layer that simulates a dynamic backend using localStorage.
 * Seeds default mock data on first run and exposes typed CRUD helpers plus a
 * lightweight pub/sub so React components can subscribe to changes.
 *
 * Includes an auth system (signup / signin / signout) backed by localStorage.
 */
import SEED from "@/data/seed"

const NAMESPACE = "qube:"
const VERSION = 2

export const KEYS = {
  VERSION: `${NAMESPACE}version`,
  USERS: `${NAMESPACE}users`,
  SESSION: `${NAMESPACE}session`,
  USER: `${NAMESPACE}user`,
  CLASSES: `${NAMESPACE}classes`,
  TRAINERS: `${NAMESPACE}trainers`,
  BOOKINGS: `${NAMESPACE}bookings`,
  TRAINER_BOOKINGS: `${NAMESPACE}trainerBookings`,
  MESSAGES: `${NAMESPACE}messages`,
  PLANS: `${NAMESPACE}plans`,
  TESTIMONIALS: `${NAMESPACE}testimonials`,
  FAQS: `${NAMESPACE}faqs`,
  STATS: `${NAMESPACE}stats`,
}

/* ------------------------------------------------------------------ */
/* Low-level helpers                                                  */
/* ------------------------------------------------------------------ */

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null || raw === undefined) return fallback
    return JSON.parse(raw)
  } catch (err) {
    console.warn(`[storage] read failed for "${key}"`, err)
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    emit(key, value)
    return true
  } catch (err) {
    console.error(`[storage] write failed for "${key}"`, err)
    return false
  }
}

/* ------------------------------------------------------------------ */
/* Pub/sub                                                            */
/* ------------------------------------------------------------------ */

const listeners = new Map() // key -> Set<callback>

export function subscribe(key, callback) {
  if (!listeners.has(key)) listeners.set(key, new Set())
  listeners.get(key).add(callback)
  const handler = (e) => {
    if (e.key === key) callback(get(key))
  }
  window.addEventListener("storage", handler)
  return () => {
    listeners.get(key)?.delete(callback)
    window.removeEventListener("storage", handler)
  }
}

function emit(key, value) {
  listeners.get(key)?.forEach((cb) => {
    try {
      cb(value)
    } catch (err) {
      console.error(`[storage] listener error for "${key}"`, err)
    }
  })
}

/* ------------------------------------------------------------------ */
/* Initialization                                                     */
/* ------------------------------------------------------------------ */

export function init() {
  const currentVersion = read(KEYS.VERSION, null)
  if (currentVersion !== VERSION) {
    // Fresh install or version bump -> seed everything
    write(KEYS.USERS, [SEED.user])
    write(KEYS.SESSION, null)
    write(KEYS.USER, SEED.user)
    write(KEYS.CLASSES, SEED.classes)
    write(KEYS.TRAINERS, SEED.trainers)
    write(KEYS.BOOKINGS, SEED.bookings)
    write(KEYS.TRAINER_BOOKINGS, SEED.trainerBookings)
    write(KEYS.MESSAGES, SEED.messages)
    write(KEYS.PLANS, SEED.plans)
    write(KEYS.TESTIMONIALS, SEED.testimonials)
    write(KEYS.FAQS, SEED.faqs)
    write(KEYS.STATS, SEED.stats)
    write(KEYS.VERSION, VERSION)
    return
  }

  const ensure = (key, seed) => {
    if (localStorage.getItem(key) === null) write(key, seed)
  }
  ensure(KEYS.USERS, [SEED.user])
  ensure(KEYS.SESSION, null)
  ensure(KEYS.USER, SEED.user)
  ensure(KEYS.CLASSES, SEED.classes)
  ensure(KEYS.TRAINERS, SEED.trainers)
  ensure(KEYS.BOOKINGS, SEED.bookings)
  ensure(KEYS.TRAINER_BOOKINGS, SEED.trainerBookings)
  ensure(KEYS.MESSAGES, SEED.messages)
  ensure(KEYS.PLANS, SEED.plans)
  ensure(KEYS.TESTIMONIALS, SEED.testimonials)
  ensure(KEYS.FAQS, SEED.faqs)
  ensure(KEYS.STATS, SEED.stats)
}

export function resetAll() {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key))
  init()
}

/* ------------------------------------------------------------------ */
/* Generic accessors                                                  */
/* ------------------------------------------------------------------ */

export function get(key) {
  return read(key, null)
}

export function set(key, value) {
  return write(key, value)
}

const uid = (prefix = "id") =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

/* ------------------------------------------------------------------ */
/* Auth (signup / signin / signout)                                   */
/* ------------------------------------------------------------------ */

function createFreshUser({ name, email, password }) {
  return {
    id: uid("u"),
    name,
    email,
    password, // demo only — never store plaintext passwords in production
    phone: "",
    avatar: "",
    joinedAt: new Date().toISOString(),
    membership: {
      plan: null,
      status: "none",
      billing: "monthly",
      startDate: null,
      renewalDate: null,
      price: 0,
    },
    stats: {
      streak: 0,
      workoutsThisWeek: 0,
      totalWorkouts: 0,
      caloriesBurned: 0,
      minutesTrained: 0,
      goalCompletion: 0,
    },
    goals: ["Get stronger", "Stay consistent"],
  }
}

export const authStore = {
  users: () => get(KEYS.USERS) || [],

  currentUser: () => {
    const session = get(KEYS.SESSION)
    if (!session?.userId) return null
    return authStore.users().find((u) => u.id === session.userId) || null
  },

  isAuthenticated: () => !!authStore.currentUser(),

  signup: ({ name, email, password }) => {
    const users = authStore.users()
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "An account with this email already exists." }
    }
    const user = createFreshUser({ name, email, password })
    write(KEYS.USERS, [...users, user])
    write(KEYS.SESSION, { userId: user.id })
    write(KEYS.USER, user)
    return { ok: true, user }
  },

  signin: ({ email, password }) => {
    const users = authStore.users()
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!user) return { ok: false, error: "No account found with that email." }
    if (user.password !== password) return { ok: false, error: "Incorrect password." }
    write(KEYS.SESSION, { userId: user.id })
    write(KEYS.USER, user)
    return { ok: true, user }
  },

  signout: () => {
    write(KEYS.SESSION, null)
    write(KEYS.USER, null)
  },
}

/* ------------------------------------------------------------------ */
/* User / Membership (operates on the current authenticated user)     */
/* ------------------------------------------------------------------ */

function patchCurrentUser(patchFn) {
  const user = authStore.currentUser()
  if (!user) return null
  const users = authStore.users().map((u) => (u.id === user.id ? patchFn(u) : u))
  write(KEYS.USERS, users)
  const updated = users.find((u) => u.id === user.id)
  write(KEYS.USER, updated)
  return updated
}

export const userStore = {
  get: () => authStore.currentUser(),

  update: (patch) => patchCurrentUser((u) => ({ ...u, ...patch })),

  updateStats: (patch) =>
    patchCurrentUser((u) => ({ ...u, stats: { ...u.stats, ...patch } })),

  setMembership: (plan, billing = "monthly") => {
    const plans = get(KEYS.PLANS) || SEED.plans
    const found = plans.find((p) => p.id === plan) || plans[1]
    const price = billing === "annual" ? found.annual : found.monthly
    const renewal = new Date()
    renewal.setDate(renewal.getDate() + (billing === "annual" ? 365 : 30))
    return patchCurrentUser((u) => ({
      ...u,
      membership: {
        ...u.membership,
        plan: found.id,
        status: "active",
        billing,
        price,
        startDate: u.membership?.startDate || new Date().toISOString(),
        renewalDate: renewal.toISOString(),
      },
    }))
  },

  cancelMembership: () =>
    patchCurrentUser((u) => ({
      ...u,
      membership: { ...u.membership, status: "cancelled" },
    })),
}

/* ------------------------------------------------------------------ */
/* Classes                                                            */
/* ------------------------------------------------------------------ */

export const classStore = {
  all: () => get(KEYS.CLASSES) || SEED.classes,
  get: (id) => (get(KEYS.CLASSES) || SEED.classes).find((c) => c.id === id),
  byCategory: (cat) => {
    const all = get(KEYS.CLASSES) || SEED.classes
    return cat === "All" ? all : all.filter((c) => c.category === cat)
  },
  categories: () => {
    const all = get(KEYS.CLASSES) || SEED.classes
    return ["All", ...Array.from(new Set(all.map((c) => c.category)))]
  },
}

/* ------------------------------------------------------------------ */
/* Trainers                                                           */
/* ------------------------------------------------------------------ */

export const trainerStore = {
  all: () => get(KEYS.TRAINERS) || SEED.trainers,
  get: (id) => (get(KEYS.TRAINERS) || SEED.trainers).find((t) => t.id === id),
  toggleAvailability: (id) => {
    const all = trainerStore.all().map((t) =>
      t.id === id ? { ...t, available: !t.available } : t
    )
    write(KEYS.TRAINERS, all)
    return all.find((t) => t.id === id)
  },
}

/* ------------------------------------------------------------------ */
/* Class Bookings (scoped to the current user)                        */
/* ------------------------------------------------------------------ */

export const bookingStore = {
  all: () => {
    const user = authStore.currentUser()
    if (!user) return []
    return (get(KEYS.BOOKINGS) || []).filter((b) => b.userId === user.id)
  },

  get: (id) => (get(KEYS.BOOKINGS) || []).find((b) => b.id === id),

  upcoming: () => {
    const user = authStore.currentUser()
    if (!user) return []
    const today = new Date().toISOString().slice(0, 10)
    return (get(KEYS.BOOKINGS) || [])
      .filter((b) => b.userId === user.id && b.date >= today && b.status !== "cancelled")
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  },

  isBooked: (classId, date, time) => {
    const user = authStore.currentUser()
    if (!user) return false
    return (get(KEYS.BOOKINGS) || []).some(
      (b) =>
        b.userId === user.id &&
        b.classId === classId &&
        b.date === date &&
        b.time === time &&
        b.status !== "cancelled"
    )
  },

  create: ({ classId, className, category, trainerId, trainerName, date, time, duration }) => {
    const user = authStore.currentUser()
    if (!user) return null
    if (bookingStore.isBooked(classId, date, time)) return null
    const bookings = get(KEYS.BOOKINGS) || []
    const booking = {
      id: uid("b"),
      userId: user.id,
      classId,
      className,
      category,
      trainerId,
      trainerName,
      date,
      time,
      duration: duration || 45,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    }
    write(KEYS.BOOKINGS, [booking, ...bookings])
    userStore.updateStats({
      totalWorkouts: (user.stats?.totalWorkouts || 0) + 1,
      workoutsThisWeek: (user.stats?.workoutsThisWeek || 0) + 1,
      minutesTrained: (user.stats?.minutesTrained || 0) + (duration || 45),
    })
    return booking
  },

  reschedule: (id, date, time) => {
    const bookings = (get(KEYS.BOOKINGS) || []).map((b) =>
      b.id === id ? { ...b, date, time, status: "confirmed" } : b
    )
    write(KEYS.BOOKINGS, bookings)
    return bookings.find((b) => b.id === id)
  },

  cancel: (id) => {
    const bookings = (get(KEYS.BOOKINGS) || []).map((b) =>
      b.id === id ? { ...b, status: "cancelled" } : b
    )
    write(KEYS.BOOKINGS, bookings)
    return bookings.find((b) => b.id === id)
  },

  remove: (id) => {
    write(KEYS.BOOKINGS, (get(KEYS.BOOKINGS) || []).filter((b) => b.id !== id))
  },
}

/* ------------------------------------------------------------------ */
/* Trainer (1-on-1) Bookings (scoped to the current user)             */
/* ------------------------------------------------------------------ */

export const trainerBookingStore = {
  all: () => {
    const user = authStore.currentUser()
    if (!user) return []
    return (get(KEYS.TRAINER_BOOKINGS) || []).filter((b) => b.userId === user.id)
  },

  create: ({ trainerId, trainerName, date, time, focus }) => {
    const user = authStore.currentUser()
    if (!user) return null
    const all = get(KEYS.TRAINER_BOOKINGS) || []
    const booking = {
      id: uid("tb"),
      userId: user.id,
      trainerId,
      trainerName,
      date,
      time,
      focus: focus || "General session",
      status: "pending",
      createdAt: new Date().toISOString(),
    }
    write(KEYS.TRAINER_BOOKINGS, [booking, ...all])
    return booking
  },

  cancel: (id) => {
    write(
      KEYS.TRAINER_BOOKINGS,
      (get(KEYS.TRAINER_BOOKINGS) || []).filter((b) => b.id !== id)
    )
  },
}

/* ------------------------------------------------------------------ */
/* Contact / Messages                                                 */
/* ------------------------------------------------------------------ */

export const messageStore = {
  all: () => get(KEYS.MESSAGES) || [],
  create: ({ name, email, subject, message }) => {
    const all = get(KEYS.MESSAGES) || []
    const user = authStore.currentUser()
    const entry = {
      id: uid("m"),
      userId: user?.id || null,
      name,
      email,
      subject: subject || "General enquiry",
      message,
      date: new Date().toISOString(),
      read: false,
    }
    write(KEYS.MESSAGES, [entry, ...all])
    return entry
  },
  markRead: (id) => {
    const all = (get(KEYS.MESSAGES) || []).map((m) =>
      m.id === id ? { ...m, read: true } : m
    )
    write(KEYS.MESSAGES, all)
  },
  remove: (id) => {
    write(KEYS.MESSAGES, (get(KEYS.MESSAGES) || []).filter((m) => m.id !== id))
  },
}

/* ------------------------------------------------------------------ */
/* Static content (plans, testimonials, faqs, stats)                   */
/* ------------------------------------------------------------------ */

export const contentStore = {
  plans: () => get(KEYS.PLANS) || SEED.plans,
  testimonials: () => get(KEYS.TESTIMONIALS) || SEED.testimonials,
  faqs: () => get(KEYS.FAQS) || SEED.faqs,
  stats: () => get(KEYS.STATS) || SEED.stats,
}

export default {
  KEYS,
  init,
  resetAll,
  get,
  set,
  subscribe,
  authStore,
  userStore,
  classStore,
  trainerStore,
  bookingStore,
  trainerBookingStore,
  messageStore,
  contentStore,
}