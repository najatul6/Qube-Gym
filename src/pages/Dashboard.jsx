import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Flame, Dumbbell, Clock, Target, Calendar, TrendingUp, Zap,
  X, CalendarClock, CheckCircle2, RefreshCw, Settings, Trophy,
} from "lucide-react"
import PageHeader from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogClose, DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/toast"
import SmartImage from "@/components/shared/SmartImage"
import {
  userStore, bookingStore, trainerBookingStore, contentStore,
} from "@/utils/storage"
import {
  useUser, useBookings, useTrainerBookings,
} from "@/hooks/useStorage"
import { DAYS, nextDateForDay, formatDate, relativeDay } from "@/utils/dates"
import { cn } from "@/utils/cn"

export default function Dashboard() {
  const { toast } = useToast()
  const user = useUser()
  const bookings = useBookings()
  const trainerBookings = useTrainerBookings()

  const [reschedule, setReschedule] = useState(null)
  const [rescheduleDay, setRescheduleDay] = useState("Mon")
  const [rescheduleTime, setRescheduleTime] = useState("18:00")

  const upcoming = useMemo(
    () =>
      bookings
        .filter((b) => b.status !== "cancelled" && b.date >= new Date().toISOString().slice(0, 10))
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    [bookings]
  )

  const stats = user?.stats || {}
  const membership = user?.membership || {}
  const plan = (contentStore.plans().find((p) => p.id === membership.plan) || {})

  const handleCancel = (id, name) => {
    bookingStore.cancel(id)
    toast({ title: "Booking cancelled", description: `${name} was removed from your schedule.`, variant: "default" })
  }

  const openReschedule = (b) => {
    setReschedule(b)
    setRescheduleDay(DAYS[(new Date(b.date + "T00:00:00").getDay() + 6) % 7] || "Mon")
    setRescheduleTime(b.time)
  }

  const confirmReschedule = () => {
    if (!reschedule) return
    const date = nextDateForDay(rescheduleDay)
    bookingStore.reschedule(reschedule.id, date, rescheduleTime)
    toast({
      title: "Rescheduled!",
      description: `${reschedule.className} moved to ${formatDate(date)} at ${rescheduleTime}.`,
      variant: "success",
    })
    setReschedule(null)
  }

  const handleCancelTrainer = (id, name) => {
    trainerBookingStore.cancel(id)
    toast({ title: "Session cancelled", description: `Your session with ${name} was cancelled.`, variant: "default" })
  }

  const statCards = [
    { label: "Day streak", value: stats.streak, icon: Flame, accent: "text-orange-400" },
    { label: "This week", value: stats.workoutsThisWeek, icon: Calendar, accent: "text-neon" },
    { label: "Total workouts", value: stats.totalWorkouts, icon: Dumbbell, accent: "text-emerald-400" },
    { label: "Minutes trained", value: stats.minutesTrained, icon: Clock, accent: "text-cyan-400" },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Member Dashboard"
        title="Welcome back,"
        highlight={`${user?.name?.split(" ")[0] || "Athlete"}.`}
        description="Your membership, schedule and progress — all in one place."
      />

      <section className="container-px py-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Membership card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl border border-neon/20 bg-gradient-to-br from-ink-800/80 to-ink-950 p-6"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-neon/15 blur-[80px]" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <Badge variant={membership.status === "active" ? "success" : "destructive"}>
                  {membership.status === "active" ? "Active" : "Cancelled"}
                </Badge>
                <Trophy className="h-5 w-5 text-neon" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Current plan</p>
              <h3 className="font-display text-3xl font-bold capitalize">{plan.name || membership.plan}</h3>
              <p className="mt-1 text-sm text-muted-foreground capitalize">
                {membership.billing} · ${membership.price}/{membership.billing === "annual" ? "year" : "month"}
              </p>

              <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Renews</span>
                  <span className="font-medium">{formatDate(membership.renewalDate?.slice(0, 10))}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Member since</span>
                  <span className="font-medium">{formatDate(membership.startDate?.slice(0, 10))}</span>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <Link to="/pricing">
                    <Settings className="h-4 w-4" />
                    Manage
                  </Link>
                </Button>
                <Button asChild size="sm" className="flex-1">
                  <Link to="/classes">
                    <Zap className="h-4 w-4" />
                    Book class
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {statCards.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="rounded-2xl border border-white/10 bg-card/50 p-4"
                >
                  <s.icon className={cn("h-5 w-5", s.accent)} />
                  <p className="mt-3 font-display text-2xl font-bold">{s.value?.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Goal progress */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="mt-4 rounded-2xl border border-white/10 bg-card/50 p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-neon" />
                  <h3 className="font-semibold">Weekly goal</h3>
                </div>
                <span className="text-sm font-bold text-neon">{stats.goalCompletion}%</span>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.goalCompletion}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-neon-deep to-neon"
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {stats.workoutsThisWeek} of 5 weekly sessions complete. Keep the streak alive!
              </p>
            </motion.div>
          </div>
        </div>

        {/* Upcoming classes */}
        <div className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
              <CalendarClock className="h-5 w-5 text-neon" />
              Upcoming classes
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/classes">Browse all</Link>
            </Button>
          </div>

          {upcoming.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
              <p className="text-muted-foreground">No upcoming classes. Time to book your next session!</p>
              <Button asChild className="mt-4">
                <Link to="/classes">Book a class</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {upcoming.map((b) => (
                  <motion.div
                    key={b.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/50 p-5"
                  >
                    <div className="flex items-start justify-between">
                      <Badge variant="default">{b.category}</Badge>
                      <span className="text-xs text-muted-foreground">{relativeDay(b.date)}</span>
                    </div>
                    <h3 className="mt-3 font-display text-lg font-semibold">{b.className}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">with {b.trainerName}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-neon" />
                        {formatDate(b.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-neon" />
                        {b.time} · {b.duration}m
                      </span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => openReschedule(b)}
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Reschedule
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleCancel(b.id, b.className)}
                      >
                        <X className="h-3.5 w-3.5" />
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Trainer sessions */}
        {trainerBookings.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-5 flex items-center gap-2 font-display text-2xl font-bold">
              <TrendingUp className="h-5 w-5 text-neon" />
              Personal training sessions
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trainerBookings.map((tb) => (
                <div
                  key={tb.id}
                  className="rounded-2xl border border-white/10 bg-card/50 p-5"
                >
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary">{tb.status}</Badge>
                    <span className="text-xs text-muted-foreground">{relativeDay(tb.date)}</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold">{tb.trainerName}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{tb.focus}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-neon" />
                      {formatDate(tb.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-neon" />
                      {tb.time}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-4 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleCancelTrainer(tb.id, tb.trainerName)}
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancel session
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Reschedule dialog */}
      <Dialog open={!!reschedule} onOpenChange={(o) => !o && setReschedule(null)}>
        <DialogContent>
          <DialogClose />
          <DialogHeader>
            <DialogTitle>Reschedule {reschedule?.className}</DialogTitle>
            <DialogDescription>Pick a new day and time for this class.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">Day</p>
              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                {DAYS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setRescheduleDay(d)}
                    className={cn(
                      "shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
                      rescheduleDay === d
                        ? "border-neon bg-neon text-ink-950"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Time</p>
              <div className="grid grid-cols-4 gap-2">
                {["06:30", "07:00", "08:00", "10:00", "12:00", "16:00", "18:00", "19:00", "20:00"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setRescheduleTime(t)}
                    className={cn(
                      "rounded-lg border px-2 py-2 text-xs font-semibold transition-all",
                      rescheduleTime === t
                        ? "border-neon bg-neon text-ink-950"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setReschedule(null)}>Cancel</Button>
            <Button onClick={confirmReschedule}>
              <CheckCircle2 className="h-4 w-4" />
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}