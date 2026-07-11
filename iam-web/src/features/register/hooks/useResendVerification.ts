import { useMutation } from '@tanstack/react-query'
import { registerService } from '../services/register.service'
import type { ResendVerificationRequest } from '../types/register.types'

export function useResendVerification() {
  return useMutation({
    mutationFn: (payload: ResendVerificationRequest) => registerService.resendVerification(payload),
  })
}
