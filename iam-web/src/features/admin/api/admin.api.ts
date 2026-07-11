import { apiDelete, apiGet, apiPatch, apiPost } from '@/shared/api/api-client'
import type { PageResponse } from '@/shared/types/page'
import type { UserResponse } from '@/shared/types/user'
import type {
  ChangeUserStatusRequest,
  CreateUserRequest,
  UpdateUserInfoRequest,
  UserListFilters,
} from '../types/admin.types'

export const adminApi = {
  listUsers: (page: number, size: number, filters: UserListFilters) =>
    apiGet<PageResponse<UserResponse>>('/users', { params: { page, size, ...filters } }),
  getUser: (id: string) => apiGet<UserResponse>(`/users/${id}`),
  createUser: (payload: CreateUserRequest) => apiPost<void>('/users', payload),
  updateUserInfo: (id: string, payload: UpdateUserInfoRequest) =>
    apiPatch<UserResponse>(`/users/${id}/profile`, payload),
  changeUserStatus: (id: string, payload: ChangeUserStatusRequest) =>
    apiPatch<UserResponse>(`/users/${id}/status`, payload),
  deleteUser: (id: string) => apiDelete<void>(`/users/${id}`),
  resendAccountActivation: (id: string) => apiPost<void>(`/users/${id}/resend-activation`),
}
