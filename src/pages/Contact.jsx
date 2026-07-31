import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, CheckCircle2 } from "lucide-react"
import PageHeader from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/toast"
import { messageStore } from "@/utils/storage"
import { useMessages } from "@/hooks/useStorage"

const SUBJECTS = ["General enquiry", "Membership", "Personal training", "Class booking", "Careers", "Feedback"]

export default function Contact() {
  const { toast } = useToast()
  const messages = useMessages()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", email: "", subject: "General enquiry", message: "" },
  })

  const onSubmit = (data) => {
    messageStore.create(data)
    toast({
      title: "Message sent!",
      description: `Thanks ${data.name.split(" ")[0]} — we'll reply within 24 hours.`,
      variant: "success",
    })
    reset()
  }

  const onError = () => {
    toast({
      title: "Check the form",
      description: "Please fix the highlighted fields and try again.",
      variant: "error",
    })
  }

  const contactInfo = [
    { icon: MapPin, label: "Visit us", value: "488 Forge Avenue, Suite 12\nSan Francisco, CA 94103" },
    { icon: Phone, label: "Call us", value: "+1 (415) 555-0182", href: "tel:+14155550182" },
    { icon: Mail, label: "Email us", value: "hello@qube-gym.com", href: "mailto:hello@qube-gym.com" },
    { icon: Clock, label: "Open hours", value: "Mon–Fri: 5:30 AM – 11:00 PM\nSat–Sun: 7:00 AM – 9:00 PM" },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Contact & Location"
        title="Let's"
        highlight="talk."
        description="Questions about membership, classes or training? Drop us a line — we usually reply within a day."
      />

      <section className="container-px py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-white/10 bg-card/50 p-6 sm:p-8"
          >
            <div className="mb-6 flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon/10 text-neon">
                <MessageSquare className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold">Send a message</h2>
                <p className="text-sm text-muted-foreground">We'll get back to you within 24 hours.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name *</Label>
                  <Input
                    id="name"
                    placeholder="Alex Carter"
                    aria-invalid={!!errors.name}
                    {...register("name", { required: "Name is required", minLength: { value: 2, message: "Too short" } })}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@email.com"
                    aria-invalid={!!errors.email}
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                    })}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject</Label>
                <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                  {SUBJECTS.map((s) => (
                    <label key={s} className="shrink-0 cursor-pointer">
                      <input type="radio" value={s} className="peer sr-only" {...register("subject")} />
                      <span className="block rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all peer-checked:border-neon peer-checked:bg-neon peer-checked:text-ink-950 hover:text-foreground">
                        {s}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us how we can help..."
                  aria-invalid={!!errors.message}
                  {...register("message", {
                    required: "Message is required",
                    minLength: { value: 10, message: "Please write at least 10 characters" },
                  })}
                />
                {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                <Send className="h-4 w-4" />
                Send message
              </Button>
            </form>
          </motion.div>

          {/* Info + map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {contactInfo.map((c) => (
                <div key={c.label} className="rounded-2xl border border-white/10 bg-card/50 p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon/10 text-neon">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                  {c.href ? (
                    <a href={c.href} className="mt-1 block text-sm font-medium hover:text-neon">
                      {c.value}
                    </a>
                  ) : (
                    <p className="mt-1 whitespace-pre-line text-sm font-medium">{c.value}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card/50">
              <div className="grid-bg h-64 w-full opacity-40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="relative flex h-12 w-12 mx-auto items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon/40" />
                    <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-neon text-ink-950">
                      <MapPin className="h-6 w-6" />
                    </span>
                  </span>
                  <p className="mt-3 text-sm font-semibold">qube-gym HQ</p>
                  <p className="text-xs text-muted-foreground">488 Forge Avenue, San Francisco</p>
                </div>
              </div>
            </div>

            {/* Recent submissions */}
            {messages.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-card/50 p-5">
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Your recent messages ({messages.length})
                </p>
                <ul className="space-y-2">
                  {messages.slice(0, 3).map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-3 text-xs">
                      <span className="truncate text-muted-foreground">
                        <span className="font-medium text-foreground">{m.subject}</span> — {m.name}
                      </span>
                      <span className="shrink-0 text-muted-foreground/60">
                        {new Date(m.date).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}