import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Clock, ArrowRight, Check } from "lucide-react"
import SectionHeading from "@/components/shared/SectionHeading"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/toast"
import { useAuth } from "@/hooks/useStorage"
import { classStore, bookingStore, trainerStore } from "@/utils/storage"
import { useBookings } from "@/hooks/useStorage"
import { cn } from "@/utils/cn"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export default function SchedulePreview() {
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const bookings = useBookings()
  const [activeDay, setActiveDay] = useState("Mon")

  const classes = classStore.all()
  const trainers = trainerStore.all()

  const slots = useMemo(() => {
    const list = []
    classes.forEach((c) => {
      c.schedule.forEach((s) => {
        if (s.day === activeDay) {
          list.push({
            ...c,
            time: s.time,
            trainer: trainers.find((t) => t.id === c.trainerId)?.name || "Coach",
          })
        }
      })
    })
    return list.sort((a, b) => a.time.localeCompare(b.time))
  }, [classes, trainers, activeDay])

  const isBooked = (classId, time) =>
    bookings.some((b) => b.classId === classId && b.time === time && b.status !== "cancelled")

  const handleBook = (c) => {
    if (!isAuthenticated) {
      toast({ title: "Sign in required", description: "Please sign in to book a class.", variant: "warning" })
      navigate("/signin")
      return
    }
    const today = new Date()
    const dayIdx = DAYS.indexOf(activeDay)
    const curIdx = (today.getDay() + 6) % 7 // Mon=0
    let add = (dayIdx - curIdx + 7) % 7
    if (add === 0) add = 7 // next occurrence
    const date = new Date(today)
    date.setDate(date.getDate() + add)
    const dateStr = date.toISOString().slice(0, 10)

    const result = bookingStore.create({
      classId: c.id,
      className: c.name,
      category: c.category,
      trainerId: c.trainerId,
      trainerName: c.trainer,
      date: dateStr,
      time: c.time,
      duration: c.duration,
    })
    if (result) {
      toast({
        title: "Class booked!",
        description: `${c.name} on ${activeDay} at ${c.time} is locked in.`,
        variant: "success",
      })
    } else {
      toast({
        title: "Already booked",
        description: "You've already reserved this slot.",
        variant: "warning",
      })
    }
  }

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="container-px relative">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="This week"
            title="Interactive"
            highlight="class schedule."
            description="Tap a day, book a slot — your spot is reserved instantly and synced to your dashboard."
          />
          <Button asChild variant="outline" className="shrink-0">
            <Link to="/classes">
              View all classes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Day tabs */}
        <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-2">
          {DAYS.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={cn(
                "relative rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
                activeDay === d
                  ? "text-ink-950"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {activeDay === d && (
                <motion.span
                  layoutId="day-tab"
                  className="absolute inset-0 rounded-lg bg-neon"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{d}</span>
            </button>
          ))}
        </div>

        {/* Slots */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slots.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-white/10 p-10 text-center text-muted-foreground">
              No classes scheduled for {activeDay}. Try another day.
            </div>
          )}
          {slots.map((c, i) => {
            const booked = isBooked(c.id, c.time)
            return (
              <motion.div
                key={c.id + c.time}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/50 p-5 transition-colors hover:border-neon/30"
              >
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40", c.color)} />
                <div className="relative">
                  <div className="mb-3 flex items-center justify-between">
                    <Badge variant="default">{c.category}</Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {c.time} · {c.duration}m
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold">{c.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">with {c.trainer}</p>
                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground/80">
                    {c.description}
                  </p>
                  <Button
                    onClick={() => handleBook(c)}
                    disabled={booked}
                    size="sm"
                    variant={booked ? "secondary" : "default"}
                    className="mt-4 w-full"
                  >
                    {booked ? (
                      <>
                        <Check className="h-4 w-4" />
                        Booked
                      </>
                    ) : (
                      "Book Class"
                    )}
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}