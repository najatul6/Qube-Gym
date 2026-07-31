import * as React from "react"
import { cn } from "@/utils/cn"

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-lg border border-white/10 bg-ink-900/60 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-neon/60 focus:outline-none focus:ring-2 focus:ring-neon/20 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
))
Input.displayName = "Input"

export { Input }
export default Input