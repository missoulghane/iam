import { apiGet, apiPost } from '@/shared/api/api-client'
import type { UserResponse } from '@/shared/types/user'
import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  LogoutRequest,
  ResetPasswordRequest,
} from '../types/auth.types'

// Raw HTTP calls only — no orchestration, no token storage. Refresh is
// deliberately absent here: it is handled entirely inside shared/api/interceptors
// since it is transport-level infrastructure, not a user-triggered action.
export const authApi = {
  login: (payload: LoginRequest) => apiPost<AuthResponse>('/auth/login', payload),
  logout: (payload: LogoutRequest) => apiPost<void>('/auth/logout', payload),
  forgotPassword: (payload: ForgotPasswordRequest) =>
    apiPost<void>('/auth/forgot-password', payload),
  resetPassword: (payload: ResetPasswordRequest) => apiPost<void>('/auth/reset-password', payload),
  getCurrentUser: () => apiGet<UserResponse>('/users/me'),
}
