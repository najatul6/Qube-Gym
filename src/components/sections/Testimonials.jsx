import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import SectionHeading from "@/components/shared/SectionHeading"
import SmartImage from "@/components/shared/SmartImage"
import { contentStore } from "@/utils/storage"

export default function Testimonials() {
  const testimonials = contentStore.testimonials()
  return (
    <section className="container-px py-20 lg:py-28">
      <SectionHeading
        eyebrow="Real members"
        title="Don't take our word"
        highlight="for it."
        description="Thousands of members train smarter at qube-gym. Here's what a few of them have to say."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -6 }}
            className="relative flex flex-col rounded-2xl border border-white/10 bg-card/50 p-6"
          >
            <Quote className="absolute right-5 top-5 h-8 w-8 text-neon/15" />
            <div className="mb-3 flex items-center gap-1 text-neon">
              {Array.from({ length: t.rating }).map((_, k) => (
                <Star key={k} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="flex-1 text-sm leading-relaxed text-foreground/90">
              "{t.quote}"
            </p>
            <div className="mt-5 flex items-center gap-3">
              <SmartImage
                src={t.avatar}
                alt={t.name}
                name={t.name}
                className="h-10 w-10 shrink-0 rounded-full"
                fallbackClassName="rounded-full text-sm"
              />
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}