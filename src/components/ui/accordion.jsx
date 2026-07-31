import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/utils/cn"

const AccordionContext = React.createContext(null)

export function Accordion({ defaultIndex = null, className, children, ...props }) {
  const [openIndex, setOpenIndex] = React.useState(defaultIndex)
  const toggle = (i) => setOpenIndex((prev) => (prev === i ? null : i))
  return (
    <AccordionContext.Provider value={{ openIndex, toggle }}>
      <div className={cn("divide-y divide-white/5", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

export function AccordionItem({ index, children, className, ...props }) {
  const ctx = React.useContext(AccordionContext)
  const isOpen = ctx?.openIndex === index
  return (
    <div className={cn("py-1", className)} {...props}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { index, isOpen, ...child.props })
          : child
      )}
    </div>
  )
}

export function AccordionTrigger({ index, isOpen, children, className, ...props }) {
  const ctx = React.useContext(AccordionContext)
  return (
    <button
      type="button"
      onClick={() => ctx?.toggle(index)}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-lg px-4 py-4 text-left text-base font-semibold text-foreground transition-colors hover:bg-white/5",
        className
      )}
      aria-expanded={isOpen}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          "h-5 w-5 shrink-0 text-neon transition-transform duration-300",
          isOpen && "rotate-180"
        )}
      />
    </button>
  )
}

export function AccordionContent({ isOpen, children, className, ...props }) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
        >
          <div className={cn("px-4 pb-4 pt-1 text-sm leading-relaxed text-muted-foreground", className)} {...props}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Accordion
