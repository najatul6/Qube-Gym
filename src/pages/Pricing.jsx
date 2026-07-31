import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Check, Sparkles, Zap, ShieldCheck, CreditCard } from "lucide-react"
import PageHeader from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/toast"
import { contentStore, userStore } from "@/utils/storage"
import { useUser, useAuth } from "@/hooks/useStorage"
import { cn } from "@/utils/cn"

export default function Pricing() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const user = useUser()
  const { isAuthenticated } = useAuth()
  const plans = contentStore.plans()
  const [billing, setBilling] = useState("monthly")
  const [checkout, setCheckout] = useState(null)

  const annualSavings = (plan) => {
    const monthlyYear = plan.monthly * 12
    return monthlyYear - plan.annual
  }

  const handleSelect = (plan) => {
    setCheckout(plan)
  }

  const confirmCheckout = () => {
    if (!checkout) return
    if (!isAuthenticated) {
      toast({ title: "Sign in required", description: "Please sign in to activate your membership.", variant: "warning" })
      navigate("/signin")
      return
    }
    userStore.setMembership(checkout.id, billing)
    toast({
      title: "Welcome to qube-gym!",
      description: `Your ${checkout.name} plan (${billing}) is active. Let's train.`,
      variant: "success",
    })
    setCheckout(null)
    navigate("/dashboard")
  }

  return (
    <>
      <PageHeader
        eyebrow="Membership Plans"
        title="Choose your"
        highlight="commitment."
        description="Simple, transparent pricing. Switch or cancel anytime — no contracts, no surprises."
      >
        {/* Billing toggle */}
        <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-ink-900/60 p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
              billing === "monthly" ? "bg-neon text-ink-950" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
              billing === "annual" ? "bg-neon text-ink-950" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Annual
            <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
              -17%
            </span>
          </button>
        </div>
      </PageHeader>

      <section className="container-px py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => {
            const price = billing === "annual" ? plan.annual : plan.monthly
            const isCurrent = user?.membership?.plan === plan.id
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-7 transition-colors",
                  plan.highlight
                    ? "border-neon/40 bg-gradient-to-b from-neon/[0.07] to-card/50 shadow-2xl shadow-neon/5"
                    : "border-white/10 bg-card/50"
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="gap-1 bg-neon text-ink-950">
                      <Sparkles className="h-3 w-3" />
                      {plan.tagline}
                    </Badge>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                  {!plan.highlight && (
                    <p className="text-xs text-muted-foreground">{plan.tagline}</p>
                  )}
                </div>

                <div className="mb-1 flex items-end gap-1">
                  <span className="font-display text-5xl font-bold">${price}</span>
                  <span className="mb-1.5 text-sm text-muted-foreground">
                    /{billing === "annual" ? "year" : "month"}
                  </span>
                </div>
                {billing === "annual" && (
                  <p className="mb-5 text-xs text-emerald-400">
                    Save ${annualSavings(plan)} yearly
                  </p>
                )}
                {billing === "monthly" && <div className="mb-5" />}

                <Button
                  onClick={() => handleSelect(plan)}
                  variant={plan.highlight ? "default" : "outline"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/90">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-neon/15 text-neon">
                        <Check className="h-3 w-3" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-neon" />
            30-day money-back guarantee
          </span>
          <span className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-neon" />
            Cancel anytime
          </span>
          <span className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-neon" />
            Secure checkout
          </span>
        </div>
      </section>

      {/* Checkout modal */}
      <Dialog open={!!checkout} onOpenChange={(o) => !o && setCheckout(null)}>
        <DialogContent>
          <DialogClose />
          <DialogHeader>
            <DialogTitle>Confirm your {checkout?.name} plan</DialogTitle>
            <DialogDescription>
              You're subscribing to the {checkout?.name} plan billed {billing}. This is a demo — no payment is processed.
            </DialogDescription>
          </DialogHeader>

          {checkout && (
            <div className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-ink-950/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <span className="font-semibold">{checkout.name}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Billing</span>
                  <span className="font-semibold capitalize">{billing}</span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2">
                  <span className="text-sm text-muted-foreground">Total today</span>
                  <span className="font-display text-xl font-bold text-neon">
                    ${billing === "annual" ? checkout.annual : checkout.monthly}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-muted-foreground">
                <CreditCard className="h-4 w-4 text-neon" />
                Demo checkout — your membership will be activated instantly in localStorage.
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setCheckout(null)}>
              Back
            </Button>
            <Button onClick={confirmCheckout}>
              <Zap className="h-4 w-4" />
              Activate membership
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}