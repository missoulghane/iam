import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { registerService } from '../services/register.service'
import type { ActivateAccountRequest } from '../types/register.types'

export function useActivateAccount() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: ActivateAccountRequest) => registerService.activateAccount(payload),
    onSuccess: () => navigate('/login', { replace: true }),
  })
}
