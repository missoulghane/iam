import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../services/admin.service'
import { ADMIN_USERS_QUERY_KEY } from './useUsersList'

interface ChangeUserStatusVariables {
  id: string
  enabled: boolean
}

export function useChangeUserStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, enabled }: ChangeUserStatusVariables) =>
      adminService.changeUserStatus(id, { enabled }),
    onSuccess: (updatedUser, variables) => {
      queryClient.setQueryData(['admin', 'users', variables.id], updatedUser)
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY })
    },
  })
}
