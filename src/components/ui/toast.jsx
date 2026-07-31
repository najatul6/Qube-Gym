import * as React from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, AlertTriangle, Info, X, XCircle } from "lucide-react"
import { cn } from "@/utils/cn"

const ToastContext = React.createContext(null)

const VARIANTS = {
  default: { icon: Info, accent: "text-foreground", ring: "ring-white/10" },
  success: { icon: CheckCircle2, accent: "text-emerald-400", ring: "ring-emerald-500/30" },
  error: { icon: XCircle, accent: "text-destructive", ring: "ring-destructive/30" },
  warning: { icon: AlertTriangle, accent: "text-amber-400", ring: "ring-amber-500/30" },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([])

  const dismiss = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = React.useCallback(
    ({ title, description, variant = "default", duration = 4000 }) => {
      const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
      setToasts((prev) => [...prev, { id, title, description, variant, duration }])
      if (duration !== Infinity) {
        setTimeout(() => dismiss(id), duration)
      }
      return id
    },
    [dismiss]
  )

  const value = React.useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed bottom-0 right-0 z-[100] flex w-full max-w-sm flex-col gap-3 p-4 sm:p-6">
          <AnimatePresence>
            {toasts.map((t) => {
              const v = VARIANTS[t.variant] || VARIANTS.default
              const Icon = v.icon
              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, x: 60, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 60, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className={cn(
                    "pointer-events-auto flex items-start gap-3 rounded-xl border border-white/10 bg-ink-900/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl ring-1",
                    v.ring
                  )}
                >
                  <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", v.accent)} />
                  <div className="flex-1 space-y-0.5">
                    {t.title && (
                      <p className="text-sm font-semibold text-foreground">{t.title}</p>
                    )}
                    {t.description && (
                      <p className="text-xs text-muted-foreground">{t.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => dismiss(t.id)}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                    aria-label="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>")
  return ctx
}

export default ToastProvider