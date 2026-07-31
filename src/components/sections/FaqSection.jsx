import { motion } from "framer-motion"
import SectionHeading from "@/components/shared/SectionHeading"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { contentStore } from "@/utils/storage"

export default function FaqSection() {
  const faqs = contentStore.faqs()
  return (
    <section className="container-px py-20 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading
          align="left"
          eyebrow="FAQ"
          title="Questions?"
          highlight="We've got answers."
          description="Everything you need to know about training, memberships and booking at qube-gym."
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-white/10 bg-card/40 p-2"
        >
          <Accordion defaultIndex={0}>
            {faqs.map((f, i) => (
              <AccordionItem key={f.id} index={i}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}