import { lazy } from 'react'
import { Route } from 'react-router'

const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'))
const ActivateAccountPage = lazy(() => import('./pages/ActivateAccountPage'))

export const registerPublicRoutes = (
  <>
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/verify-email" element={<VerifyEmailPage />} />
    <Route path="/activate-account" element={<ActivateAccountPage />} />
  </>
)
