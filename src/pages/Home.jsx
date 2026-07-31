import Hero from "@/components/sections/Hero"
import FeatureGrid from "@/components/sections/FeatureGrid"
import SchedulePreview from "@/components/sections/SchedulePreview"
import StatsBand from "@/components/sections/StatsBand"
import Testimonials from "@/components/sections/Testimonials"
import FaqSection from "@/components/sections/FaqSection"
import CtaBand from "@/components/sections/CtaBand"

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <SchedulePreview />
      <StatsBand />
      <Testimonials />
      <FaqSection />
      <CtaBand />
    </>
  )
}