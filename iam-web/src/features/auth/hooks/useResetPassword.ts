import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { authService } from '../services/auth.service'
import type { ResetPasswordRequest } from '../types/auth.types'

export function useResetPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) => authService.resetPassword(payload),
    onSuccess: () => navigate('/login', { replace: true }),
  })
}
