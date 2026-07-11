import { Suspense } from 'react'
import { Route, Routes } from 'react-router'
import { AdminRoute, authPublicRoutes, ProtectedRoute } from '@/features/auth'
import { registerPublicRoutes } from '@/features/register'
import { profileProtectedRoutes } from '@/features/profile'
import { homeProtectedRoutes } from '@/features/home'
import { adminProtectedRoutes } from '@/features/admin'
import { AuthenticatedLayout } from '@/app/layouts/AuthenticatedLayout'
import { LoadingState } from '@/shared/components/LoadingState'

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingState label="Chargement..." />}>
      <Routes>
        {authPublicRoutes}
        {registerPublicRoutes}
        <Route element={<ProtectedRoute />}>
          <Route element={<AuthenticatedLayout />}>
            {homeProtectedRoutes}
            {profileProtectedRoutes}
            <Route element={<AdminRoute />}>
              {adminProtectedRoutes}
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}
