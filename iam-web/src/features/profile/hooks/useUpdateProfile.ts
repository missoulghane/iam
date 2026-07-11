import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth'
import { profileService } from '../services/profile.service'
import { PROFILE_QUERY_KEY } from './useProfile'
import type { UpdateProfileRequest } from '../types/profile.types'

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { refreshUser } = useAuth()

  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) => profileService.updateProfile(payload),
    onSuccess: async (updatedUser) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, updatedUser)
      // Keeps the AppBar/UserMenu (fed by the auth session) in sync with the edit.
      await refreshUser()
    },
  })
}
