import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import Stack from '@mui/material/Stack'
import { AppButton } from '@/shared/components/AppButton'
import { ErrorState } from '@/shared/components/ErrorState'
import { LoadingState } from '@/shared/components/LoadingState'
import { PageHeader } from '@/shared/components/PageHeader'
import { getErrorMessage } from '@/shared/api/error-handler'
import { useNotification } from '@/shared/hooks/useNotification'
import { useUser } from '../hooks/useUser'
import { useChangeUserStatus } from '../hooks/useChangeUserStatus'
import { useResendAccountActivation } from '../hooks/useResendAccountActivation'
import { DeleteUserDialog } from '../components/DeleteUserDialog'
import { UserDetailCard } from '../components/UserDetailCard'

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const userQuery = useUser(id ?? '')
  const changeUserStatusMutation = useChangeUserStatus()
  const resendAccountActivationMutation = useResendAccountActivation()
  const { notify } = useNotification()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <>
      <PageHeader
        title="Détail de l'utilisateur"
        subtitle="Consultez et gérez ce compte utilisateur"
      />

      {userQuery.isLoading && <LoadingState label="Chargement de l'utilisateur..." />}
      {userQuery.isError && (
        <ErrorState
          message={getErrorMessage(userQuery.error)}
          onRetry={() => userQuery.refetch()}
        />
      )}
      {userQuery.data && (
        <Stack spacing={3} sx={{ maxWidth: 640 }}>
          <UserDetailCard user={userQuery.data} />
          <Stack direction="row" spacing={2}>
            <AppButton
              variant="contained"
              onClick={() => navigate(`/admin/users/${userQuery.data.id}/edit`)}
            >
              Modifier
            </AppButton>
            <AppButton
              variant="outlined"
              loading={changeUserStatusMutation.isPending}
              onClick={() =>
                changeUserStatusMutation.mutate({
                  id: userQuery.data.id,
                  enabled: !userQuery.data.enabled,
                })
              }
            >
              {userQuery.data.enabled ? 'Désactiver' : 'Activer'}
            </AppButton>
            {!userQuery.data.verified && (
              <AppButton
                variant="outlined"
                loading={resendAccountActivationMutation.isPending}
                onClick={() =>
                  resendAccountActivationMutation.mutate(userQuery.data.id, {
                    onSuccess: () => notify("Email d'activation renvoyé avec succès."),
                    onError: (error) => notify(getErrorMessage(error), 'error'),
                  })
                }
              >
                Renvoyer l'invitation
              </AppButton>
            )}
            <AppButton variant="outlined" color="error" onClick={() => setDeleteDialogOpen(true)}>
              Supprimer
            </AppButton>
          </Stack>

          <DeleteUserDialog
            open={deleteDialogOpen}
            user={userQuery.data}
            onClose={() => setDeleteDialogOpen(false)}
            onDeleted={() => navigate('/admin/users')}
          />
        </Stack>
      )}
    </>
  )
}
