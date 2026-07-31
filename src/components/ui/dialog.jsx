import * as React from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/utils/cn"

const DialogContext = React.createContext(null)

export function Dialog({ open, onOpenChange, children }) {
  React.useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && onOpenChange?.(false)
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onOpenChange])

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {createPortal(
        <AnimatePresence>
          {open && (
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => onOpenChange?.(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className={cn(
                  "relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-2xl shadow-black/50"
                )}
                role="dialog"
                aria-modal="true"
              >
                {children}
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </DialogContext.Provider>
  )
}

export function DialogContent({ className, children, ...props }) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  )
}

export function DialogHeader({ className, ...props }) {
  return (
    <div className={cn("mb-4 flex flex-col space-y-1.5", className)} {...props} />
  )
}

export function DialogTitle({ className, ...props }) {
  return (
    <h2 className={cn("font-display text-2xl font-bold tracking-tight", className)} {...props} />
  )
}

export function DialogDescription({ className, ...props }) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
}

export function DialogClose({ className, ...props }) {
  const ctx = React.useContext(DialogContext)
  return (
    <button
      onClick={() => ctx?.onOpenChange?.(false)}
      className={cn(
        "absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground",
        className
      )}
      aria-label="Close"
      {...props}
    >
      <X className="h-5 w-5" />
    </button>
  )
}

export function DialogFooter({ className, ...props }) {
  return (
    <div className={cn("mt-6 flex justify-end gap-3", className)} {...props} />
  )
}

export default Dialog