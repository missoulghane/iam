import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { onSessionExpired } from '@/shared/api/auth-events'
import { tokenStorage } from '@/shared/api/token-storage'
import type { UserResponse } from '@/shared/types/user'
import { authService } from '../services/auth.service'
import type { LoginRequest } from '../types/auth.types'

type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  status: AuthStatus
  user: UserResponse | null
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('idle')
  const [user, setUser] = useState<UserResponse | null>(null)

  // Bootstrap the session on first load from a persisted token, if any.
  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      if (!tokenStorage.getAccessToken()) {
        setStatus('unauthenticated')
        return
      }
      try {
        const currentUser = await authService.fetchCurrentUser()
        if (!cancelled) {
          setUser(currentUser)
          setStatus('authenticated')
        }
      } catch {
        if (!cancelled) {
          tokenStorage.clear()
          setStatus('unauthenticated')
        }
      }
    }

    void bootstrap()
    return () => {
      cancelled = true
    }
  }, [])

  // A background request's silent token refresh failed: force logout.
  useEffect(
    () =>
      onSessionExpired(() => {
        setUser(null)
        setStatus('unauthenticated')
      }),
    [],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      login: async (credentials) => {
        const currentUser = await authService.login(credentials)
        setUser(currentUser)
        setStatus('authenticated')
      },
      logout: async () => {
        await authService.logout()
        setUser(null)
        setStatus('unauthenticated')
      },
      // Re-syncs the session's user (e.g. after a profile edit) so the AppBar/
      // UserMenu reflect it without features/profile reaching into this feature's
      // internals — it only calls this one sanctioned, public entry point.
      refreshUser: async () => {
        const currentUser = await authService.fetchCurrentUser()
        setUser(currentUser)
      },
    }),
    [status, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
