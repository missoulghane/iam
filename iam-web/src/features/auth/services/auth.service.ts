import { tokenStorage } from '@/shared/api/token-storage'
import type { UserResponse } from '@/shared/types/user'
import { authApi } from '../api/auth.api'
import type { ForgotPasswordRequest, LoginRequest, ResetPasswordRequest } from '../types/auth.types'

export const authService = {
  async login(credentials: LoginRequest): Promise<UserResponse> {
    const tokens = await authApi.login(credentials)
    tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken)
    return authApi.getCurrentUser()
  },

  async logout(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken()
    if (refreshToken) {
      try {
        await authApi.logout({ refreshToken })
      } catch {
        // Best-effort server-side revocation: local logout proceeds regardless.
      }
    }
    tokenStorage.clear()
  },

  forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
    return authApi.forgotPassword(payload)
  },

  resetPassword(payload: ResetPasswordRequest): Promise<void> {
    return authApi.resetPassword(payload)
  },

  fetchCurrentUser(): Promise<UserResponse> {
    return authApi.getCurrentUser()
  },
}
