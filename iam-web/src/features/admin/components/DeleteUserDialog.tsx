import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { useNotification } from '@/shared/hooks/useNotification'
import type { UserResponse } from '@/shared/types/user'
import { useDeleteUser } from '../hooks/useDeleteUser'

interface DeleteUserDialogProps {
  open: boolean
  user: UserResponse
  onClose: () => void
  onDeleted?: () => void
}

export function DeleteUserDialog({ open, user, onClose, onDeleted }: DeleteUserDialogProps) {
  const deleteUserMutation = useDeleteUser()
  const { notify } = useNotification()

  const handleConfirm = () => {
    deleteUserMutation.mutate(user.id, {
      onSuccess: () => {
        notify('Utilisateur supprimé avec succès.')
        onClose()
        onDeleted?.()
      },
    })
  }

  return (
    <ConfirmDialog
      open={open}
      title="Supprimer l'utilisateur"
      message={`Voulez-vous vraiment supprimer ${user.firstName} ${user.lastName} (${user.email}) ? Cette action est irréversible.`}
      confirmLabel="Supprimer"
      destructive
      loading={deleteUserMutation.isPending}
      onConfirm={handleConfirm}
      onCancel={onClose}
    />
  )
}
