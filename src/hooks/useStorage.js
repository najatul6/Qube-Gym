import { useEffect, useState, useCallback } from "react"
import { subscribe, KEYS } from "@/utils/storage"

/**
 * Subscribe a React component to a localStorage-backed slice.
 * Re-renders whenever the underlying store emits a change.
 */
export function useStorage(key, selector = (v) => v) {
  const read = () => {
    try {
      const raw = localStorage.getItem(key)
      return selector(raw ? JSON.parse(raw) : null)
    } catch {
      return selector(null)
    }
  }

  const [state, setState] = useState(read)

  useEffect(() => {
    setState(read())
    const unsub = subscribe(key, (value) => setState(selector(value)))
    return unsub
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return state
}

export function useUser() {
  return useStorage(KEYS.USER)
}

export function useBookings() {
  return useStorage(KEYS.BOOKINGS, (v) => (Array.isArray(v) ? v : []))
}

export function useTrainerBookings() {
  return useStorage(KEYS.TRAINER_BOOKINGS, (v) => (Array.isArray(v) ? v : []))
}

export function useMessages() {
  return useStorage(KEYS.MESSAGES, (v) => (Array.isArray(v) ? v : []))
}

export function useTrainers() {
  return useStorage(KEYS.TRAINERS, (v) => (Array.isArray(v) ? v : []))
}

export function useClasses() {
  return useStorage(KEYS.CLASSES, (v) => (Array.isArray(v) ? v : []))
}

/** Force a re-render of any component (handy after manual store writes). */
export function useForceUpdate() {
  const [, set] = useState(0)
  return useCallback(() => set((n) => n + 1), [])
}