import { profileApi } from '../api/profile.api'
import type { ChangePasswordRequest, UpdateProfileRequest } from '../types/profile.types'

export const profileService = {
  getMe: () => profileApi.getMe(),
  updateProfile: (payload: UpdateProfileRequest) => profileApi.updateProfile(payload),
  changePassword: (payload: ChangePasswordRequest) => profileApi.changePassword(payload),
}
