import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../services/admin.service'
import { ADMIN_USERS_QUERY_KEY } from './useUsersList'
import type { UpdateUserInfoRequest } from '../types/admin.types'

export function useUpdateUserInfo(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateUserInfoRequest) => adminService.updateUserInfo(id, payload),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['admin', 'users', id], updatedUser)
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY })
    },
  })
}
