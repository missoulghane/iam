import { useMutation } from '@tanstack/react-query'
import { registerService } from '../services/register.service'
import type { RegisterUserRequest } from '../types/register.types'

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterUserRequest) => registerService.register(payload),
  })
}
