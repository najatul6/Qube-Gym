import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
  className,
}) {
  const alignClass =
    align === "center" ? "text-center mx-auto" : align === "left" ? "text-left" : "text-right ml-auto"
  return (
    <div className={cn("max-w-2xl", alignClass, className)}>
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className={cn(
            "mb-3 inline-flex items-center gap-2 rounded-full border border-neon/20 bg-neon/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-neon",
            align === "center" && "mx-auto"
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-neon" />
          {eyebrow}
        </motion.div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl"
      >
        {title} {highlight && <span className="text-gradient">{highlight}</span>}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}