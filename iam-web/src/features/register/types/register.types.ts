// Mirrors the request schemas from the OpenAPI spec exactly.
export interface RegisterUserRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface ResendVerificationRequest {
  email: string
}

export interface VerifyEmailRequest {
  token: string
}

export interface ActivateAccountRequest {
  token: string
  newPassword: string
}
