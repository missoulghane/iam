import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import { AppButton } from '@/shared/components/AppButton'
import { ErrorState } from '@/shared/components/ErrorState'
import { FormTextField } from '@/shared/components/FormTextField'
import { LoadingState } from '@/shared/components/LoadingState'
import { PageHeader } from '@/shared/components/PageHeader'
import { getErrorMessage } from '@/shared/api/error-handler'
import { useNotification } from '@/shared/hooks/useNotification'
import { useUser } from '../hooks/useUser'
import { useUpdateUserInfo } from '../hooks/useUpdateUserInfo'
import { editUserSchema, type EditUserFormValues } from '../schemas/edit-user.schema'

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const userQuery = useUser(id ?? '')
  const updateUserInfoMutation = useUpdateUserInfo(id ?? '')
  const { notify } = useNotification()
  const { control, handleSubmit, reset } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: { firstName: '', lastName: '' },
  })

  useEffect(() => {
    if (userQuery.data) {
      reset({ firstName: userQuery.data.firstName, lastName: userQuery.data.lastName })
    }
  }, [userQuery.data, reset])

  const onSubmit = handleSubmit((values) => {
    updateUserInfoMutation.mutate(values, {
      onSuccess: () => {
        notify('Utilisateur mis à jour avec succès.')
        navigate(`/admin/users/${id}`)
      },
    })
  })

  return (
    <>
      <PageHeader
        title="Modifier l'utilisateur"
        subtitle="Mettez à jour les informations de ce compte"
      />

      {userQuery.isLoading && <LoadingState label="Chargement de l'utilisateur..." />}
      {userQuery.isError && (
        <ErrorState
          message={getErrorMessage(userQuery.error)}
          onRetry={() => userQuery.refetch()}
        />
      )}

      {userQuery.data && (
        <Stack component="form" onSubmit={onSubmit} spacing={2} noValidate sx={{ maxWidth: 480 }}>
          {updateUserInfoMutation.isError && (
            <Alert severity="error">{getErrorMessage(updateUserInfoMutation.error)}</Alert>
          )}
          <FormTextField
            name="firstName"
            control={control}
            label="Prénom"
            autoComplete="given-name"
            autoFocus
          />
          <FormTextField name="lastName" control={control} label="Nom" autoComplete="family-name" />
          <Stack direction="row" spacing={2}>
            <AppButton type="submit" variant="contained" loading={updateUserInfoMutation.isPending}>
              Enregistrer
            </AppButton>
            <AppButton
              variant="outlined"
              disabled={updateUserInfoMutation.isPending}
              onClick={() => navigate(`/admin/users/${id}`)}
            >
              Annuler
            </AppButton>
          </Stack>
        </Stack>
      )}
    </>
  )
}
