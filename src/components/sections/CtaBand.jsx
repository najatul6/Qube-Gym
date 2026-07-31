import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CtaBand() {
  return (
    <section className="container-px py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-neon/20 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 p-10 text-center sm:p-16"
      >
        <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-neon/15 blur-[100px]" />
        <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute inset-0 grid-bg opacity-20" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-neon/30 bg-neon/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-neon">
            <Zap className="h-3.5 w-3.5" />
            Start today
          </span>
          <h2 className="mx-auto mt-5 max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            Your first session is on us.
            <br />
            <span className="text-gradient">What are you waiting for?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Join qube-gym today and get a free trial class, a personalized plan
            and access to the member app — no commitment required.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="xl">
              <Link to="/pricing">
                Join Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link to="/contact">Talk to us</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}