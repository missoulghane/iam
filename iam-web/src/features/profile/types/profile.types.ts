// Mirrors the request schemas from the OpenAPI spec exactly.
export interface UpdateProfileRequest {
  firstName: string
  lastName: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}
