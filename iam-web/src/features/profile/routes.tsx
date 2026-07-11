import { lazy } from 'react'
import { Route } from 'react-router'

const ProfilePage = lazy(() => import('./pages/ProfilePage'))

export const profileProtectedRoutes = <Route path="/profile" element={<ProfilePage />} />
