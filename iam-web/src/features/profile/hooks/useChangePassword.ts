import { useMutation } from '@tanstack/react-query'
import { profileService } from '../services/profile.service'
import type { ChangePasswordRequest } from '../types/profile.types'

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => profileService.changePassword(payload),
  })
}
