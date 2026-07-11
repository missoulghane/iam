import { Navigate, Outlet, useLocation } from 'react-router'
import { LoadingState } from '@/shared/components/LoadingState'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'idle') {
    return <LoadingState label="Chargement de la session..." />
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
