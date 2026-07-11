import { useQuery } from '@tanstack/react-query'
import { adminService } from '../services/admin.service'

export function useUser(id: string) {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => adminService.getUser(id),
    enabled: !!id,
  })
}
