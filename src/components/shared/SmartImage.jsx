import { useState } from "react"
import { cn } from "@/utils/cn"

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

export default function SmartImage({
  src,
  alt = "",
  name = "",
  className,
  imgClassName,
  fallbackClassName,
}) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-ink-700 to-ink-900 text-2xl font-bold text-neon/80",
          className,
          fallbackClassName
        )}
      >
        <span>{initials(name || alt)}</span>
      </div>
    )
  }

  return (
    <div className={cn("overflow-hidden", className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setError(true)}
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </div>
  )
}