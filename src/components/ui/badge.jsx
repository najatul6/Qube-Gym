import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/utils/cn"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-neon/15 text-neon",
        secondary: "border-white/10 bg-white/5 text-muted-foreground",
        outline: "border-white/15 text-foreground",
        destructive: "border-transparent bg-destructive/15 text-destructive",
        success: "border-transparent bg-emerald-500/15 text-emerald-400",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
export default Badge