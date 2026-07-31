import { useEffect, useRef, useState } from "react"
import { useInView, useMotionValue, animate } from "framer-motion"

export default function Counter({ to = 0, suffix = "", duration = 2, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const count = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const unsub = count.on("change", (v) => setDisplay(Math.round(v)))
    return unsub
  }, [count])

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration, ease: [0.4, 0, 0.2, 1] })
      return controls.stop
    }
  }, [inView, to, duration, count])

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString()}
      {suffix}
    </span>
  )
}