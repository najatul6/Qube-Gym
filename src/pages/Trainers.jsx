import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Star, Award, CalendarCheck, Users, X } from "lucide-react"
import { useForm } from "react-hook-form"
import PageHeader from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/toast"
import SmartImage from "@/components/shared/SmartImage"
import { trainerStore, trainerBookingStore } from "@/utils/storage"
import { useTrainers, useTrainerBookings, useAuth } from "@/hooks/useStorage"
import { DAYS, nextDateForDay } from "@/utils/dates"

const TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "16:00", "18:00"]

export default function Trainers() {
  const { toast } = useToast()
  useTrainers()
  useTrainerBookings()
  const trainers = trainerStore.all()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [open, setOpen] = useState(false)

  const openBooking = (trainer) => {
    if (!isAuthenticated) {
      toast({ title: "Sign in required", description: "Please sign in to book a session.", variant: "warning" })
      navigate("/signin")
      return
    }
    setSelected(trainer)
    setOpen(true)
  }

  return (
    <>
      <PageHeader
        eyebrow="Meet the team"
        title="Coaches who"
        highlight="make you better."
        description="Certified specialists in strength, conditioning, boxing and mobility — hand-picked to push you past your ceiling."
      />

      <section className="container-px py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trainers.map((t, i) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-card/50 transition-colors hover:border-neon/30"
            >
              <div className="relative aspect-square overflow-hidden">
                <SmartImage
                  src={t.image}
                  alt={t.name}
                  name={t.name}
                  className="h-full w-full"
                  imgClassName="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
                <div className="absolute left-3 top-3">
                  <Badge variant={t.available ? "success" : "secondary"}>
                    <span className={`h-1.5 w-1.5 rounded-full ${t.available ? "bg-emerald-400" : "bg-muted-foreground"}`} />
                    {t.available ? "Available" : "Booked"}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-display text-lg font-bold">{t.name}</h3>
                  <p className="text-xs text-neon">{t.role}</p>
                </div>
              </div>

              <div className="p-5">
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{t.bio}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {t.specializations.map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center">
                  <div>
                    <p className="flex items-center justify-center gap-1 text-sm font-bold text-neon">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {t.rating}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Rating</p>
                  </div>
                  <div>
                    <p className="flex items-center justify-center gap-1 text-sm font-bold text-foreground">
                      <Award className="h-3.5 w-3.5" />
                      {t.experience}y
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Exp</p>
                  </div>
                  <div>
                    <p className="flex items-center justify-center gap-1 text-sm font-bold text-foreground">
                      <Users className="h-3.5 w-3.5" />
                      {t.sessionsBooked}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Sessions</p>
                  </div>
                </div>

                <Button
                  onClick={() => openBooking(t)}
                  disabled={!t.available}
                  className="mt-5 w-full"
                  variant={t.available ? "default" : "secondary"}
                >
                  <CalendarCheck className="h-4 w-4" />
                  {t.available ? "Book Session" : "Unavailable"}
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <TrainerBookingDialog
        trainer={selected}
        open={open}
        onOpenChange={setOpen}
        toast={toast}
      />
    </>
  )
}

function TrainerBookingDialog({ trainer, open, onOpenChange, toast }) {
  const [day, setDay] = useState("Mon")
  const [time, setTime] = useState(TIME_SLOTS[0])
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { focus: "General technique session" },
  })

  const onSubmit = (data) => {
    if (!trainer) return
    const date = nextDateForDay(day)
    trainerBookingStore.create({
      trainerId: trainer.id,
      trainerName: trainer.name,
      date,
      time,
      focus: data.focus,
    })
    toast({
      title: "Session requested!",
      description: `${trainer.name} on ${day} at ${time}. Check your dashboard.`,
      variant: "success",
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose />
        <DialogHeader>
          <DialogTitle>Book with {trainer?.name}</DialogTitle>
          <DialogDescription>
            {trainer?.role} · Pick a day, time and tell {trainer?.name?.split(" ")[0]} your focus.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="mb-2 block">Day</Label>
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {DAYS.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDay(d)}
                  className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                    day === d
                      ? "border-neon bg-neon text-ink-950"
                      : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Time</Label>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTime(t)}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                    time === t
                      ? "border-neon bg-neon text-ink-950"
                      : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="focus">Session focus</Label>
            <Textarea
              id="focus"
              rows={2}
              placeholder="e.g. Deadlift technique, mobility assessment, boxing footwork..."
              {...register("focus", { required: "Please describe your focus" })}
            />
            {errors.focus && <p className="text-xs text-destructive">{errors.focus.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Confirm Booking
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}