import { useMutation } from '@tanstack/react-query'
import { adminService } from '../services/admin.service'

export function useResendAccountActivation() {
  return useMutation({
    mutationFn: (id: string) => adminService.resendAccountActivation(id),
  })
}
