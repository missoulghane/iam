import { adminApi } from '../api/admin.api'
import type {
  ChangeUserStatusRequest,
  CreateUserRequest,
  UpdateUserInfoRequest,
  UserListFilters,
} from '../types/admin.types'

export const adminService = {
  listUsers: (page: number, size: number, filters: UserListFilters) =>
    adminApi.listUsers(page, size, filters),
  getUser: (id: string) => adminApi.getUser(id),
  createUser: (payload: CreateUserRequest) => adminApi.createUser(payload),
  updateUserInfo: (id: string, payload: UpdateUserInfoRequest) =>
    adminApi.updateUserInfo(id, payload),
  changeUserStatus: (id: string, payload: ChangeUserStatusRequest) =>
    adminApi.changeUserStatus(id, payload),
  deleteUser: (id: string) => adminApi.deleteUser(id),
  resendAccountActivation: (id: string) => adminApi.resendAccountActivation(id),
}
