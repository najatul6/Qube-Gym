# Qube Gym

A modern, high-converting fitness web application built with React, Tailwind CSS, and a mock localStorage backend. Qube Gym delivers a sleek, dark-mode experience with neon accents, fluid micro-interactions, and a full member management system — no server required.

![Qube Gym Preview](src/assets/hero.png)

## Features

### Member Experience
- **Hero section** with high-impact typography, motion background effects, and dual CTAs (Join Now / Book Free Trial)
- **Interactive class schedule** — browse classes by day, book slots instantly, and see real-time booking status
- **Filterable class catalog** — sort by discipline (HIIT, Strength, Yoga, Boxing) with animated cards
- **Trainer profiles** — browse certified coaches, view specializations, and book 1-on-1 sessions via modal
- **Membership plans** — Monthly/Annual toggle with live discount calculation and checkout flow
- **Member dashboard** — view active membership, upcoming bookings, workout streaks, and personal stats
- **Contact form** — React Hook Form with validation, toast notifications, and localStorage persistence

### Technical Highlights
- **Mock backend** — Central `storage.js` utility with full CRUD operations, pub/sub reactivity, and localStorage persistence
- **Authentication system** — Signup, signin, and signout backed by localStorage with protected routes
- **Auth-aware actions** — Booking, trainer sessions, and checkout all redirect to sign-in for guests
- **Page transitions** — Framer Motion `AnimatePresence` for smooth enter/exit animations
- **Responsive design** — Mobile-first with a slide-in navigation drawer
- **Micro-interactions** — Hover states, animated counters, spring-loaded navigation indicators

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18 (via Vite) |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| UI Components | Custom shadcn-style components (plain JSX) |
| Animations | Framer Motion & Animate.css |
| Forms | React Hook Form |
| State/Persistence | LocalStorage (simulated backend) |
| Icons | Lucide React |
| Deployment | Vercel (with SPA fallback) |

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/najatul6/Qube-Gym.git
cd Qube-Gym

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

## Demo Access

The app seeds a demo account on first load. Sign in with:

- **Email:** `alex@qube-gym.com`
- **Password:** `demo1234`

Or click the **"Try the demo account"** button on the sign-in page.

You can also sign up with a new account at `/signup`.

## Project Structure

```
src/
├── data/           # Mock seed data (classes, trainers, bookings, plans, etc.)
├── utils/          # Core utilities (storage.js backend, cn, dates)
├── hooks/          # React hooks (useAuth, useUser, useBookings, etc.)
├── components/
│   ├── ui/         # Reusable UI primitives (Button, Card, Dialog, Sheet, etc.)
│   ├── shared/     # Shared components (Logo, Counter, SmartImage, etc.)
│   ├── layout/     # Layout (Header, Footer, Layout, ProtectedRoute)
│   └── sections/   # Page sections (Hero, FeatureGrid, SchedulePreview, etc.)
├── pages/          # Route pages (Home, Classes, Trainers, Pricing, etc.)
├── App.jsx         # Application routing
└── main.jsx        # React entry point
```

## API (Mock Storage Layer)

All data is persisted in `localStorage` under the `qube:` namespace. The `storage.js` module exposes:

```js
import { authStore, userStore, classStore, trainerStore, bookingStore, ... } from "@/utils/storage"

// Auth
authStore.signup({ name, email, password })
authStore.signin({ email, password })
authStore.signout()

// Bookings
bookingStore.create({ classId, className, category, trainerId, trainerName, date, time, duration })
bookingStore.cancel(id)
bookingStore.upcoming()

// Content
contentStore.plans()
contentStore.testimonials()
contentStore.faqs()
contentStore.stats()
```

## Deployment

### Vercel

The project includes a `vercel.json` configuration for SPA routing and security headers. To deploy:

```bash
npm run build
vercel --prod
```

Or connect the GitHub repository to Vercel for automatic deployments.

## License

MIT
