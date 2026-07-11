import { apiGet, apiPatch } from '@/shared/api/api-client'
import type { UserResponse } from '@/shared/types/user'
import type { ChangePasswordRequest, UpdateProfileRequest } from '../types/profile.types'

export const profileApi = {
  getMe: () => apiGet<UserResponse>('/users/me'),
  updateProfile: (payload: UpdateProfileRequest) =>
    apiPatch<UserResponse>('/users/me/profile', payload),
  changePassword: (payload: ChangePasswordRequest) => apiPatch<void>('/users/me/password', payload),
}
