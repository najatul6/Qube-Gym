import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home'
import Classes from '@/pages/Classes'
import Trainers from '@/pages/Trainers'
import Pricing from '@/pages/Pricing'
import Dashboard from '@/pages/Dashboard'
import Contact from '@/pages/Contact'
import SignIn from '@/pages/SignIn'
import SignUp from '@/pages/SignUp'
import NotFound from '@/pages/NotFound'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import { ToastProvider } from '@/components/ui/toast'
import { init as initStorage } from '@/utils/storage'

// Seed localStorage with default mock data on first load.
initStorage()

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}
