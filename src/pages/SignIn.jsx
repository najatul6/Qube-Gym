import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { Mail, Lock, LogIn, Eye, EyeOff, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast"
import { useAuth } from "@/hooks/useStorage"
import Logo from "@/components/layout/Logo"

export default function SignIn() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const { signin } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const from = location.state?.from?.pathname || "/dashboard"

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = (data) => {
    const result = signin({ email: data.email, password: data.password })
    if (result.ok) {
      toast({
        title: "Welcome back!",
        description: `Signed in as ${result.user.name.split(" ")[0]}.`,
        variant: "success",
      })
      navigate(from, { replace: true })
    } else {
      toast({ title: "Sign in failed", description: result.error, variant: "error" })
    }
  }

  const fillDemo = () => {
    signin({ email: "alex@qube-gym.com", password: "demo1234" })
    toast({
      title: "Demo account",
      description: "Signed in as Alex Carter. Explore the dashboard!",
      variant: "success",
    })
    navigate(from, { replace: true })
  }

  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden px-5 py-16">
      <div className="absolute inset-0 grid-bg mask-fade-b opacity-40" />
      <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-neon/15 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-2xl border border-white/10 bg-card/60 p-8 backdrop-blur-xl">
          <div className="mb-6 flex flex-col items-center text-center">
            <Logo className="mb-4" />
            <h1 className="font-display text-2xl font-bold">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to manage your training.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  className="pl-9"
                  aria-invalid={!!errors.email}
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                  })}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-9"
                  aria-invalid={!!errors.password}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 4, message: "Min 4 characters" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              <LogIn className="h-4 w-4" />
              Sign in
            </Button>
          </form>

          <button
            onClick={fillDemo}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-neon/20 bg-neon/5 px-4 py-2.5 text-sm font-semibold text-neon transition-colors hover:bg-neon/10"
          >
            <Sparkles className="h-4 w-4" />
            Try the demo account
          </button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-neon hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground/60">
          Demo: alex@qube-gym.com · demo1234
        </p>
      </motion.div>
    </section>
  )
}
