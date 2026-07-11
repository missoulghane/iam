import { Navigate, Outlet, useLocation } from 'react-router'
import { LoadingState } from '@/shared/components/LoadingState'
import { useAuth } from '../hooks/useAuth'

export function AdminRoute() {
  const { status, user } = useAuth()
  const location = useLocation()

  if (status === 'idle') {
    return <LoadingState label="Chargement de la session..." />
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!user?.roles.includes('ROLE_ADMIN')) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
