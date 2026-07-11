import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { GridPaginationModel } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/shared/components/AppButton'
import { ErrorState } from '@/shared/components/ErrorState'
import { PageHeader } from '@/shared/components/PageHeader'
import { getErrorMessage } from '@/shared/api/error-handler'
import { useNotification } from '@/shared/hooks/useNotification'
import type { UserResponse } from '@/shared/types/user'
import { useUsersList } from '../hooks/useUsersList'
import type { UserListFilters } from '../types/admin.types'
import { DeleteUserDialog } from '../components/DeleteUserDialog'
import { UserFilterBar } from '../components/UserFilterBar'
import { UsersDataGrid } from '../components/UsersDataGrid'
import { useChangeUserStatus } from '../hooks/useChangeUserStatus'
import { useResendAccountActivation } from '../hooks/useResendAccountActivation'

export default function UsersListPage() {
  const navigate = useNavigate()
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  })
  const [filters, setFilters] = useState<UserListFilters>({})
  const [deletingUser, setDeletingUser] = useState<UserResponse | null>(null)

  const usersQuery = useUsersList(paginationModel.page, paginationModel.pageSize, filters)
  const changeUserStatusMutation = useChangeUserStatus()
  const resendAccountActivationMutation = useResendAccountActivation()
  const { notify } = useNotification()

  const handleResendActivation = (user: UserResponse) => {
    resendAccountActivationMutation.mutate(user.id, {
      onSuccess: () => notify("Email d'activation renvoyé avec succès."),
      onError: (error) => notify(getErrorMessage(error), 'error'),
    })
  }

  const handleFiltersChange = (newFilters: UserListFilters) => {
    setFilters(newFilters)
    setPaginationModel((model) => ({ ...model, page: 0 }))
  }

  return (
    <>
      <PageHeader
        title="Gestion des utilisateurs"
        subtitle="Consultez, créez et gérez les comptes utilisateurs"
        actions={
          <AppButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/users/new')}
          >
            Nouvel utilisateur
          </AppButton>
        }
      />

      <UserFilterBar filters={filters} onChange={handleFiltersChange} />

      {usersQuery.isError ? (
        <ErrorState
          message={getErrorMessage(usersQuery.error)}
          onRetry={() => usersQuery.refetch()}
        />
      ) : (
        <UsersDataGrid
          rows={usersQuery.data?.content ?? []}
          rowCount={usersQuery.data?.totalElements ?? 0}
          loading={usersQuery.isLoading || usersQuery.isFetching}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          onView={(user) => navigate(`/admin/users/${user.id}`)}
          onEdit={(user) => navigate(`/admin/users/${user.id}/edit`)}
          onToggleStatus={(user) =>
            changeUserStatusMutation.mutate({ id: user.id, enabled: !user.enabled })
          }
          onDelete={(user) => setDeletingUser(user)}
          onResendActivation={handleResendActivation}
        />
      )}

      {deletingUser && (
        <DeleteUserDialog open user={deletingUser} onClose={() => setDeletingUser(null)} />
      )}
    </>
  )
}
