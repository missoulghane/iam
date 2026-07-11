import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../services/admin.service'
import { ADMIN_USERS_QUERY_KEY } from './useUsersList'
import type { CreateUserRequest } from '../types/admin.types'

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateUserRequest) => adminService.createUser(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY }),
  })
}
