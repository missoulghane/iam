import { useAuth } from '@/features/auth'
import { MainLayout } from './MainLayout'

// Seam between the auth feature and the (feature-agnostic) MainLayout: pulls
// session data out of context and passes it down as plain props.
export function AuthenticatedLayout() {
  const { user, logout } = useAuth()

  if (!user) {
    // ProtectedRoute never renders this while unauthenticated or loading.
    return null
  }

  return <MainLayout user={user} onLogout={() => void logout()} />
}
