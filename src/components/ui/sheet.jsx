import * as React from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/utils/cn"

export function Sheet({ open, onOpenChange, side = "right", children, className }) {
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

  const sideVariants = {
    right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
    left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
    top: { initial: { y: "-100%" }, animate: { y: 0 }, exit: { y: "-100%" } },
    bottom: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } },
  }
  const sv = sideVariants[side] || sideVariants.right
  const positionClass =
    side === "right"
      ? "inset-y-0 right-0 h-full w-full max-w-sm"
      : side === "left"
      ? "inset-y-0 left-0 h-full w-full max-w-sm"
      : side === "top"
      ? "inset-x-0 top-0 w-full"
      : "inset-x-0 bottom-0 w-full"

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[95]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => onOpenChange?.(false)}
          />
          <motion.div
            initial={sv.initial}
            animate={sv.animate}
            exit={sv.exit}
            transition={{ type: "spring", stiffness: 360, damping: 34 }}
            className={cn(
              "absolute border-white/10 bg-ink-900 shadow-2xl shadow-black/50",
              positionClass,
              className
            )}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export function SheetClose({ className, ...props }) {
  return (
    <button
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

export default Sheet