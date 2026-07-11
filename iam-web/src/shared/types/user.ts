// Mirrors UserResponse from the OpenAPI schema. Shared because both the auth
// feature (session state) and the profile feature (Étape 6) need it, and a
// feature must never import types from another feature.
export interface UserResponse {
  id: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  verified: boolean
  enabled: boolean
}
