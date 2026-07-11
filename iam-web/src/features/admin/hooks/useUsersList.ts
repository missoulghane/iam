import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { adminService } from '../services/admin.service'
import type { UserListFilters } from '../types/admin.types'

export const ADMIN_USERS_QUERY_KEY = ['admin', 'users'] as const

export function useUsersList(page: number, size: number, filters: UserListFilters) {
  return useQuery({
    queryKey: [...ADMIN_USERS_QUERY_KEY, page, size, filters],
    queryFn: () => adminService.listUsers(page, size, filters),
    placeholderData: keepPreviousData,
  })
}
