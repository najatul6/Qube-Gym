import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Zap, LogOut, User, UserPlus, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose } from '@/components/ui/sheet'
import { cn } from '@/utils/cn'
import { useAuth } from '@/hooks/useStorage'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/classes', label: 'Classes' },
  { to: '/trainers', label: 'Trainers' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, signout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  const handleSignOut = () => {
    signout()
    setDropdown(false)
    navigate('/')
  }

  const navLinkClass = ({ isActive }) =>
    cn(
      'relative px-3 py-2 text-sm font-medium transition-colors hover:text-foreground',
      isActive ? 'text-neon' : 'text-muted-foreground'
    )

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-white/10 bg-ink-950/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <div className='container-px flex h-16 items-center justify-between gap-4 lg:h-20'>
        <Logo />

        <nav className='hidden items-center gap-1 lg:flex'>
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass} end={item.to === '/'}>
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId='nav-active'
                      className='absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-neon'
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className='hidden items-center gap-2 lg:flex'>
          {isAuthenticated ? (
            <div className='relative'>
              <button
                onClick={() => setDropdown((d) => !d)}
                className='flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-white/10'
              >
                <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neon/10 text-neon'>
                  <User className='h-4 w-4' />
                </span>
                <span className='hidden sm:inline'>{user?.name?.split(' ')[0]}</span>
                <ChevronDown className='h-3.5 w-3.5 text-muted-foreground' />
              </button>
              <AnimatePresence>
                {dropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className='absolute top-full right-0 mt-2 w-44 rounded-xl border border-white/10 bg-card/90 p-1 shadow-xl backdrop-blur-xl'
                  >
                    <Link
                      to='/dashboard'
                      className='flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-white/5'
                      onClick={() => setDropdown(false)}
                    >
                      <User className='h-4 w-4' />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground'
                    >
                      <LogOut className='h-4 w-4' />
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Button asChild variant='ghost' size='sm' className='text-muted-foreground'>
                <Link to='/signin'>Sign in</Link>
              </Button>
              <Button asChild size='sm'>
                <Link to='/pricing'>
                  <Zap className='h-4 w-4' />
                  Join Now
                </Link>
              </Button>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen(true)}
          className='rounded-lg p-2 text-foreground transition-colors hover:bg-white/5 lg:hidden'
          aria-label='Open menu'
        >
          <Menu className='h-6 w-6' />
        </button>
      </div>

      <Sheet open={open} onOpenChange={setOpen} side='right'>
        <SheetClose />
        <div className='flex h-full flex-col p-6 pt-20'>
          <nav className='flex flex-col gap-1'>
            {NAV.map((item, i) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-lg px-4 py-3 text-lg font-semibold transition-colors',
                      isActive
                        ? 'bg-neon/10 text-neon'
                        : 'text-foreground hover:bg-white/5'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </motion.div>
            ))}
          </nav>
          <div className='mt-auto flex flex-col gap-3'>
            {isAuthenticated ? (
              <Button size='lg' variant='outline' onClick={handleSignOut}>
                <LogOut className='h-4 w-4' />
                Sign out
              </Button>
            ) : (
              <>
                <Button asChild size='lg'>
                  <Link to='/signin'>
                    <User className='h-4 w-4' />
                    Sign in
                  </Link>
                </Button>
                <Button asChild size='lg'>
                  <Link to='/signup'>
                    <UserPlus className='h-4 w-4' />
                    Sign up
                  </Link>
                </Button>
              </>
            )}
            <p className='text-center text-xs text-muted-foreground'>
              Train hard. Live sharp.
            </p>
          </div>
        </div>
      </Sheet>
    </header>
  )
}
