// Mirrors the request schemas from the OpenAPI spec exactly.
export interface CreateUserRequest {
  email: string
  firstName: string
  lastName: string
}

// Structurally identical to profile/types' UpdateProfileRequest, but not
// cross-imported: a feature must never import another feature's types.
export interface UpdateUserInfoRequest {
  firstName: string
  lastName: string
}

export interface ChangeUserStatusRequest {
  enabled: boolean
}

export interface UserListFilters {
  search?: string
  role?: string
  enabled?: boolean
}
