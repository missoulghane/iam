import { useQuery } from '@tanstack/react-query'
import { profileService } from '../services/profile.service'

export const PROFILE_QUERY_KEY = ['profile', 'me'] as const

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => profileService.getMe(),
  })
}
