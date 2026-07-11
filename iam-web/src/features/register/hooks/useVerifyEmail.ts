import { useMutation } from '@tanstack/react-query'
import { registerService } from '../services/register.service'
import type { VerifyEmailRequest } from '../types/register.types'

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (payload: VerifyEmailRequest) => registerService.verifyEmail(payload),
  })
}
