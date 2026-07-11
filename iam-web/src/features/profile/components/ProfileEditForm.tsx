import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import { AppButton } from '@/shared/components/AppButton'
import { FormTextField } from '@/shared/components/FormTextField'
import { getErrorMessage } from '@/shared/api/error-handler'
import { useNotification } from '@/shared/hooks/useNotification'
import type { UserResponse } from '@/shared/types/user'
import { useUpdateProfile } from '../hooks/useUpdateProfile'
import { updateProfileSchema, type UpdateProfileFormValues } from '../schemas/update-profile.schema'

interface ProfileEditFormProps {
  user: UserResponse
}

export function ProfileEditForm({ user }: ProfileEditFormProps) {
  const { control, handleSubmit, reset } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { firstName: user.firstName, lastName: user.lastName },
  })
  const updateProfileMutation = useUpdateProfile()
  const { notify } = useNotification()

  useEffect(() => {
    reset({ firstName: user.firstName, lastName: user.lastName })
  }, [user, reset])

  const onSubmit = handleSubmit((values) => {
    updateProfileMutation.mutate(values, {
      onSuccess: () => notify('Profil mis à jour avec succès.'),
    })
  })

  return (
    <Stack component="form" onSubmit={onSubmit} spacing={2} noValidate>
      {updateProfileMutation.isError && (
        <Alert severity="error">{getErrorMessage(updateProfileMutation.error)}</Alert>
      )}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FormTextField
          name="firstName"
          control={control}
          label="Prénom"
          autoComplete="given-name"
        />
        <FormTextField name="lastName" control={control} label="Nom" autoComplete="family-name" />
      </Stack>
      <AppButton
        type="submit"
        variant="contained"
        loading={updateProfileMutation.isPending}
        sx={{ alignSelf: 'flex-start' }}
      >
        Enregistrer
      </AppButton>
    </Stack>
  )
}
