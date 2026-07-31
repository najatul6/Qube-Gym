import { Link } from "react-router-dom"
import { cn } from "@/utils/cn"

export default function Logo({ className, onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={cn("group flex items-center gap-2.5", className)}
      aria-label="qube-gym home"
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-neon text-ink-950 shadow-[0_0_20px_rgba(212,255,58,0.4)] transition-transform duration-300 group-hover:scale-105">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7l9-4 9 4-9 4-9-4z" />
          <path d="M3 7v10l9 4 9-4V7" />
          <path d="M12 11v10" />
        </svg>
      </span>
      <span className="font-display text-lg font-bold tracking-tight">
        qube<span className="text-neon">-gym</span>
      </span>
    </Link>
  )
}