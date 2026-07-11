import { registerApi } from '../api/register.api'
import type {
  ActivateAccountRequest,
  RegisterUserRequest,
  ResendVerificationRequest,
  VerifyEmailRequest,
} from '../types/register.types'

export const registerService = {
  register(payload: RegisterUserRequest): Promise<void> {
    return registerApi.register(payload)
  },
  resendVerification(payload: ResendVerificationRequest): Promise<void> {
    return registerApi.resendVerification(payload)
  },
  verifyEmail(payload: VerifyEmailRequest): Promise<void> {
    return registerApi.verifyEmail(payload)
  },
  activateAccount(payload: ActivateAccountRequest): Promise<void> {
    return registerApi.activateAccount(payload)
  },
}
