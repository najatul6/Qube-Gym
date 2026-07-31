import { motion } from "framer-motion"
import { Zap, Users, CalendarCheck, Activity, HeartPulse, Trophy } from "lucide-react"
import SectionHeading from "@/components/shared/SectionHeading"

const features = [
  {
    icon: Zap,
    title: "Smart Programming",
    desc: "Adaptive training plans that progress with you — built by coaches who track every rep, set and PR.",
  },
  {
    icon: CalendarCheck,
    title: "Instant Booking",
    desc: "Reserve any class in two taps. Reschedule or cancel from your dashboard, no phone calls, no friction.",
  },
  {
    icon: Users,
    title: "Elite Coaches",
    desc: "A roster of certified specialists in strength, conditioning, boxing and mobility — all under one roof.",
  },
  {
    icon: Activity,
    title: "Live Progress Tracking",
    desc: "Streaks, volume, calories and goals — your dashboard turns effort into measurable momentum.",
  },
  {
    icon: HeartPulse,
    title: "Recovery Zone",
    desc: "Sauna, mobility bays and guided recovery sessions so you train hard and come back stronger.",
  },
  {
    icon: Trophy,
    title: "A Winning Community",
    desc: "Challenges, leaderboards and a culture that celebrates showing up. You won't train alone here.",
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function FeatureGrid() {
  return (
    <section className="container-px py-20 lg:py-28">
      <SectionHeading
        eyebrow="Why qube-gym"
        title="Built for people who"
        highlight="refuse to settle."
        description="Every detail — from the equipment to the app — is engineered to make you show up, push harder and come back tomorrow."
      />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={item}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/50 p-6 transition-colors hover:border-neon/30"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-neon/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-neon/10 text-neon transition-transform duration-300 group-hover:scale-110">
              <f.icon className="h-6 w-6" />
            </span>
            <h3 className="mb-2 font-display text-lg font-semibold">{f.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}