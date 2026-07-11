import { lazy } from 'react'
import { Route } from 'react-router'

const HomePage = lazy(() => import('./pages/HomePage'))

export const homeProtectedRoutes = <Route index element={<HomePage />} />
