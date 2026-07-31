import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Play, Flame, Dumbbell, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const float = {
  animate: { y: [0, -14, 0] },
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background grid + glow */}
      <div className="absolute inset-0 grid-bg mask-fade-b opacity-60" />
      <div className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-neon/20 blur-[120px] animate-glow-pulse" />
      <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px]" />

      <div className="container-px relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-neon/20 bg-neon/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-neon"
          >
            <Sparkles className="h-3.5 w-3.5" />
            #1 Rated Performance Gym 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Train hard.
            <br />
            <span className="text-gradient">Live sharp.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground"
          >
            qube-gym is where intensity meets intelligence. Elite coaching, smart
            scheduling and a community that pushes you past your limits — every
            single session.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button asChild size="xl">
              <Link to="/pricing">
                Join Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link to="/classes">
                <Play className="h-4 w-4" />
                Book Free Trial
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex items-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43b?w=80&h=80&fit=crop&crop=faces",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="h-9 w-9 rounded-full border-2 border-ink-950 object-cover"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-neon">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
              <p className="text-xs">Loved by 3,200+ members</p>
            </div>
          </motion.div>
        </div>

        {/* Visual */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl border border-white/10"
          >
            <img
              src="https://images.unsplash.com/photo-1574680097900-9e0b5f8b5b5b?w=800&h=1000&fit=crop"
              alt="Athlete training at qube-gym"
              className="h-full w-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
          </motion.div>

          <motion.div
            {...float}
            className="absolute -left-4 top-10 rounded-2xl border border-white/10 bg-ink-900/90 p-4 shadow-xl backdrop-blur-xl sm:left-2"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/15 text-neon">
                <Flame className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xl font-bold text-foreground">12</p>
                <p className="text-xs text-muted-foreground">day streak</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            {...float}
            transition={{ ...float.transition, delay: 1.5 }}
            className="absolute -right-2 bottom-10 rounded-2xl border border-white/10 bg-ink-900/90 p-4 shadow-xl backdrop-blur-xl sm:right-2"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/15 text-neon">
                <Dumbbell className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xl font-bold text-foreground">86</p>
                <p className="text-xs text-muted-foreground">workouts done</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative border-y border-white/10 bg-ink-950/40 py-4">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex items-center gap-12">
              {["HIIT", "Strength", "Yoga", "Boxing", "Cycling", "Mobility", "Recovery", "Conditioning"].map(
                (w) => (
                  <span
                    key={w + k}
                    className="font-display text-2xl font-bold uppercase tracking-tight text-white/10"
                  >
                    {w} <span className="text-neon">/</span>
                  </span>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}