import * as React from "react"
import { cn } from "@/utils/cn"

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[120px] w-full rounded-lg border border-white/10 bg-ink-900/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-neon/60 focus:outline-none focus:ring-2 focus:ring-neon/20 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
      className
    )}
    {...props}
  />
))
Textarea.displayName = "Textarea"

export { Textarea }
export default Textarea