import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import { AppButton } from '@/shared/components/AppButton'
import { FormTextField } from '@/shared/components/FormTextField'
import { getErrorMessage } from '@/shared/api/error-handler'
import { useNotification } from '@/shared/hooks/useNotification'
import { useChangePassword } from '../hooks/useChangePassword'
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '../schemas/change-password.schema'

export function ChangePasswordForm() {
  const { control, handleSubmit, reset } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  })
  const changePasswordMutation = useChangePassword()
  const { notify } = useNotification()

  const onSubmit = handleSubmit(({ confirmNewPassword, ...payload }) => {
    changePasswordMutation.mutate(payload, {
      onSuccess: () => {
        notify('Mot de passe modifié avec succès.')
        reset()
      },
    })
  })

  return (
    <Stack component="form" onSubmit={onSubmit} spacing={2} noValidate>
      {changePasswordMutation.isError && (
        <Alert severity="error">{getErrorMessage(changePasswordMutation.error)}</Alert>
      )}
      <FormTextField
        name="currentPassword"
        control={control}
        label="Mot de passe actuel"
        type="password"
        autoComplete="current-password"
      />
      <FormTextField
        name="newPassword"
        control={control}
        label="Nouveau mot de passe"
        type="password"
        autoComplete="new-password"
      />
      <FormTextField
        name="confirmNewPassword"
        control={control}
        label="Confirmer le nouveau mot de passe"
        type="password"
        autoComplete="new-password"
      />
      <AppButton
        type="submit"
        variant="contained"
        loading={changePasswordMutation.isPending}
        sx={{ alignSelf: 'flex-start' }}
      >
        Modifier le mot de passe
      </AppButton>
    </Stack>
  )
}
