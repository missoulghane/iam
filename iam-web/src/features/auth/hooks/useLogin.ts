import { useMutation } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router'
import { useAuth } from './useAuth'
import type { LoginRequest } from '../types/auth.types'

interface LocationState {
  from?: string
}

export function useLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return useMutation({
    mutationFn: (credentials: LoginRequest) => login(credentials),
    onSuccess: () => {
      const redirectTo = (location.state as LocationState | null)?.from ?? '/'
      navigate(redirectTo, { replace: true })
    },
  })
}
