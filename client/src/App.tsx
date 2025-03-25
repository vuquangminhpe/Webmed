/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import HealthAZPage from '@/pages/HealthAZPage'
import DiseaseDetailPage from '@/pages/DiseaseDetailPage'

import path from '@/constants/path'
import { getAccessTokenFromLS, localStorageEventTarget } from '@/utils/auth'
import { Toaster } from 'sonner'
import MedicinesPage from './pages/MedicinesPage/MedicinesPage'
import MedicineDetailPage from './pages/MedicineDetailPage/MedicineDetailPage'
import FeedbackPage from './pages/FeedbackPage'
import ProfilePage from './pages/ProfilePage'
import ChangePasswordPage from './pages/ChangePasswordPage'
import OrdersPage from './pages/OrdersPage/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import NotFoundPage from './pages/NotFoundPage'
import SymptomCheckerPage from './pages/SymptomCheckerPage'
import DoctorsPage from './pages/DoctorsPage'
import HealthCalculatorPage from './pages/HealthCalculatorPage'
import InsuranceGuidePage from './pages/InsuranceGuidePage'
import CheckoutPage from './pages/CheckoutPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppointmentsListPage from './pages/AppointmentsListPage'
import DoctorDetailPage from './pages/DoctorsPage/DoctorDetailPage'
import SymptomSearchPage from './pages/SymptomSearchPage/SymptomSearchPage'
import AppointmentDetailPage from './pages/AppointmentDetailPage'
import AppointmentBookingPage from './pages/AppointmentsPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = Boolean(getAccessTokenFromLS())

  if (!isAuthenticated) {
    return <Navigate to={path.login} replace />
  }

  return <>{children}</>
}

function App() {
  const queryClient = new QueryClient()

  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getAccessTokenFromLS()))

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(Boolean(getAccessTokenFromLS()))
    }

    setIsAuthenticated(Boolean(getAccessTokenFromLS()))

    localStorageEventTarget.addEventListener('clearLocalStorage', handleStorageChange)

    return () => {
      localStorageEventTarget.removeEventListener('clearLocalStorage', handleStorageChange)
    }
  }, [])

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <MainLayout>
            <Routes>
              <Route path={path.home} element={<HomePage />} />
              <Route path={path.login} element={<LoginPage />} />
              <Route path={path.register} element={<RegisterPage />} />

              <Route path={path.healthAZ} element={<HealthAZPage />} />
              <Route path={path.disease} element={<DiseaseDetailPage />} />
              <Route path={`${path.healthAZ}/symptoms`} element={<SymptomCheckerPage />} />

              <Route path={path.medicines} element={<MedicinesPage />} />
              <Route path={path.medicine} element={<MedicineDetailPage />} />

              {/* Doctor routes */}
              <Route path={path.doctors} element={<DoctorsPage />} />
              <Route path={path.doctor} element={<DoctorDetailPage />} />
              <Route path={path.doctorSymptomSearch} element={<SymptomSearchPage />} />

              {/* Appointment routes */}
              <Route
                path={path.appointments}
                element={
                  <ProtectedRoute>
                    <AppointmentsListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={path.appointment}
                element={
                  <ProtectedRoute>
                    <AppointmentDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={path.appointmentBooking}
                element={
                  <ProtectedRoute>
                    <AppointmentBookingPage />
                  </ProtectedRoute>
                }
              />

              <Route path='/resources/health-calculator' element={<HealthCalculatorPage />} />
              <Route path='/resources/insurance-guide' element={<InsuranceGuidePage />} />

              <Route path={path.feedback} element={<FeedbackPage />} />

              <Route
                path={path.profile}
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={path.changePassword}
                element={
                  <ProtectedRoute>
                    <ChangePasswordPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={path.orders}
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={path.order}
                element={
                  <ProtectedRoute>
                    <OrderDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={path.checkout}
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={path.paymentSuccess}
                element={
                  <ProtectedRoute>
                    <PaymentSuccessPage />
                  </ProtectedRoute>
                }
              />

              <Route path='*' element={<NotFoundPage />} />
            </Routes>
          </MainLayout>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </>
  )
}

export default App
