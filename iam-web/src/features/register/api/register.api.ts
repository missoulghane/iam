import { apiPost } from '@/shared/api/api-client'
import type {
  ActivateAccountRequest,
  RegisterUserRequest,
  ResendVerificationRequest,
  VerifyEmailRequest,
} from '../types/register.types'

export const registerApi = {
  register: (payload: RegisterUserRequest) => apiPost<void>('/users/register', payload),
  resendVerification: (payload: ResendVerificationRequest) =>
    apiPost<void>('/users/resend-verification', payload),
  verifyEmail: (payload: VerifyEmailRequest) => apiPost<void>('/users/verify', payload),
  activateAccount: (payload: ActivateAccountRequest) =>
    apiPost<void>('/users/activate-account', payload),
}
