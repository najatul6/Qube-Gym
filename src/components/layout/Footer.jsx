import { Link } from "react-router-dom"
import { MapPin, Clock, Phone, Mail } from "lucide-react"
import Logo from "./Logo"
import { InstagramIcon, TwitterIcon, FacebookIcon, YoutubeIcon } from "@/components/shared/SocialIcons"

const quickLinks = [
  { to: "/classes", label: "Classes & Schedule" },
  { to: "/trainers", label: "Meet the Trainers" },
  { to: "/pricing", label: "Membership Plans" },
  { to: "/dashboard", label: "Member Dashboard" },
  { to: "/contact", label: "Contact & Location" },
]

const socials = [
  { icon: InstagramIcon, href: "#", label: "Instagram" },
  { icon: TwitterIcon, href: "#", label: "Twitter" },
  { icon: FacebookIcon, href: "#", label: "Facebook" },
  { icon: YoutubeIcon, href: "#", label: "Youtube" },
]

const hours = [
  { day: "Mon – Fri", time: "5:30 AM – 11:00 PM" },
  { day: "Saturday", time: "7:00 AM – 9:00 PM" },
  { day: "Sunday", time: "8:00 AM – 6:00 PM" },
]

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/10 bg-ink-950/60">
      <div className="container-px py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              A modern high-performance gym built for people who refuse to settle.
              Train hard, recover smart, live sharp.
            </p>
            <div className="flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-muted-foreground transition-all hover:border-neon/40 hover:bg-neon/10 hover:text-neon"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-neon"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Working Hours
            </h4>
            <ul className="space-y-2.5">
              {hours.map((h) => (
                <li key={h.day} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">{h.day}</span>
                  <span className="font-medium text-foreground/90">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Visit Us
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neon" />
                <span>488 Forge Avenue, Suite 12<br />San Francisco, CA 94103</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-neon" />
                <a href="tel:+14155550182" className="hover:text-neon">+1 (415) 555-0182</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-neon" />
                <a href="mailto:hello@qube-gym.com" className="hover:text-neon">hello@qube-gym.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} qube-gym. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-neon">Privacy</a>
            <a href="#" className="hover:text-neon">Terms</a>
            <a href="#" className="hover:text-neon">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}