import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Users, Flame, ArrowRight, Check, CalendarDays } from "lucide-react"
import PageHeader from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/toast"
import SmartImage from "@/components/shared/SmartImage"
import { classStore, bookingStore, trainerStore } from "@/utils/storage"
import { useBookings, useClasses, useAuth } from "@/hooks/useStorage"
import { DAYS, nextDateForDay, formatDate } from "@/utils/dates"
import { cn } from "@/utils/cn"

const intensityColor = {
  Easy: "success",
  Hard: "default",
  Extreme: "destructive",
}

export default function Classes() {
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const bookings = useBookings()
  useClasses() // subscribe so catalog stays fresh

  const [category, setCategory] = useState("All")
  const [view, setView] = useState("catalog") // catalog | schedule

  const classes = classStore.all()
  const trainers = trainerStore.all()
  const categories = classStore.categories()

  const filtered = useMemo(
    () => (category === "All" ? classes : classes.filter((c) => c.category === category)),
    [classes, category]
  )

  const isBooked = (classId, date, time) =>
    bookings.some(
      (b) => b.classId === classId && b.date === date && b.time === time && b.status !== "cancelled"
    )

  const bookSlot = (c, day, time) => {
    if (!isAuthenticated) {
      toast({ title: "Sign in required", description: "Please sign in to book a class.", variant: "warning" })
      navigate("/signin")
      return
    }
    const date = nextDateForDay(day)
    if (isBooked(c.id, date, time)) {
      toast({ title: "Already booked", description: "You've reserved this slot already.", variant: "warning" })
      return
    }
    const result = bookingStore.create({
      classId: c.id,
      className: c.name,
      category: c.category,
      trainerId: c.trainerId,
      trainerName: trainers.find((t) => t.id === c.trainerId)?.name || "Coach",
      date,
      time,
      duration: c.duration,
    })
    if (result) {
      toast({
        title: "Class booked!",
        description: `${c.name} on ${formatDate(date)} at ${time}.`,
        variant: "success",
      })
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Classes & Schedule"
        title="Find your"
        highlight="next session."
        description="Filter by discipline, browse the weekly grid and book your spot in real time — all synced to your dashboard."
      >
        <div className="inline-flex rounded-xl border border-white/10 bg-ink-900/60 p-1">
          <button
            onClick={() => setView("catalog")}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
              view === "catalog" ? "bg-neon text-ink-950" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Catalog
          </button>
          <button
            onClick={() => setView("schedule")}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
              view === "schedule" ? "bg-neon text-ink-950" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Weekly Schedule
          </button>
        </div>
      </PageHeader>

      <section className="container-px py-16">
        <AnimatePresence mode="wait">
          {view === "catalog" ? (
            <motion.div
              key="catalog"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Filters */}
              <div className="no-scrollbar mb-10 flex gap-2 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "relative shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                      category === cat
                        ? "border-neon bg-neon text-ink-950"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:border-neon/40 hover:text-foreground"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((c, i) => {
                  const trainer = trainers.find((t) => t.id === c.trainerId)
                  return (
                    <motion.article
                      key={c.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="group overflow-hidden rounded-2xl border border-white/10 bg-card/50 transition-colors hover:border-neon/30"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <SmartImage
                          src={c.image}
                          alt={c.name}
                          name={c.name}
                          className="h-full w-full"
                          imgClassName="transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                        <div className="absolute left-3 top-3 flex gap-2">
                          <Badge variant="default">{c.category}</Badge>
                          <Badge variant={intensityColor[c.intensity] || "secondary"}>
                            <Flame className="h-3 w-3" />
                            {c.intensity}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-display text-xl font-semibold">{c.name}</h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                          {c.description}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-neon" />
                            {c.duration} min
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-neon" />
                            {c.capacity} spots
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5 text-neon" />
                            {trainer?.name?.split(" ")[0]}
                          </span>
                        </div>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {c.schedule.map((s) => {
                            const date = nextDateForDay(s.day)
                            const booked = isBooked(c.id, date, s.time)
                            return (
                              <button
                                key={s.day + s.time}
                                onClick={() => bookSlot(c, s.day, s.time)}
                                disabled={booked}
                                className={cn(
                                  "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all",
                                  booked
                                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                    : "border-white/10 bg-white/5 text-foreground hover:border-neon/50 hover:bg-neon/10 hover:text-neon"
                                )}
                              >
                                {booked ? <Check className="h-3 w-3" /> : null}
                                {s.day} {s.time}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </motion.article>
                  )
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <ScheduleGrid classes={classes} trainers={trainers} isBooked={isBooked} onBook={bookSlot} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  )
}

function ScheduleGrid({ classes, trainers, isBooked, onBook }) {
  // Build a matrix: day -> list of {class, time}
  const matrix = useMemo(() => {
    const map = {}
    DAYS.forEach((d) => (map[d] = []))
    classes.forEach((c) => {
      c.schedule.forEach((s) => {
        if (map[s.day]) map[s.day].push({ ...c, time: s.time })
      })
    })
    Object.values(map).forEach((list) => list.sort((a, b) => a.time.localeCompare(b.time)))
    return map
  }, [classes])

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[900px]">
        <div className="grid grid-cols-8 gap-3">
          <div className="sticky left-0 z-10 flex items-center justify-center rounded-lg border border-white/10 bg-ink-900/80 p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur">
            Time
          </div>
          {DAYS.map((d) => (
            <div
              key={d}
              className="flex items-center justify-center rounded-lg border border-white/10 bg-ink-900/60 p-3 text-sm font-semibold text-foreground"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="mt-3 space-y-3">
          {DAYS.map((day) => (
            <div key={day} className="grid grid-cols-8 gap-3">
              <div className="sticky left-0 z-10 flex items-center justify-center rounded-lg border border-white/10 bg-ink-900/80 p-3 text-sm font-bold text-neon backdrop-blur">
                {day}
              </div>
              {DAYS.map((_, col) => {
                const slots = matrix[day] || []
                const slot = slots[col]
                if (!slot) {
                  return (
                    <div
                      key={col}
                      className="flex min-h-[80px] items-center justify-center rounded-lg border border-dashed border-white/5 text-xs text-muted-foreground/40"
                    >
                      —
                    </div>
                  )
                }
                const date = nextDateForDay(day)
                const booked = isBooked(slot.id, date, slot.time)
                const trainer = trainers.find((t) => t.id === slot.trainerId)
                return (
                  <button
                    key={col}
                    onClick={() => onBook(slot, day, slot.time)}
                    disabled={booked}
                    className={cn(
                      "group relative flex min-h-[80px] flex-col justify-center rounded-lg border p-3 text-left transition-all",
                      booked
                        ? "border-emerald-500/30 bg-emerald-500/10"
                        : "border-white/10 bg-card/50 hover:border-neon/40 hover:bg-neon/5"
                    )}
                  >
                    <div className={cn("absolute inset-0 rounded-lg bg-gradient-to-br opacity-30", slot.color)} />
                    <div className="relative">
                      <p className="text-xs font-bold text-foreground">{slot.name}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">{slot.time}</p>
                      <p className="mt-1 text-[10px] text-neon">{trainer?.name?.split(" ")[0]}</p>
                      {booked && (
                        <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                          <Check className="h-2.5 w-2.5" /> Booked
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}