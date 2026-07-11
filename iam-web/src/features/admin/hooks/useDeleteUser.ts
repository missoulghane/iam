import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../services/admin.service'
import { ADMIN_USERS_QUERY_KEY } from './useUsersList'

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY }),
  })
}
