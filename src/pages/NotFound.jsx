import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Home as HomeIcon, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <section className="container-px flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-display text-8xl font-bold text-gradient sm:text-9xl">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
          This set is empty.
        </h1>
        <p className="mt-2 max-w-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved. Let's get you back to training.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link to="/">
              <HomeIcon className="h-4 w-4" />
              Back home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/classes">
              <ArrowLeft className="h-4 w-4" />
              Browse classes
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}