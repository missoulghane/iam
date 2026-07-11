import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'react-router'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import { AppButton } from '@/shared/components/AppButton'
import { FormTextField } from '@/shared/components/FormTextField'
import { getErrorMessage } from '@/shared/api/error-handler'
import { useResetPassword } from '../hooks/useResetPassword'
import { resetPasswordSchema, type ResetPasswordFormValues } from '../schemas/reset-password.schema'

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const { control, handleSubmit } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })
  const resetPasswordMutation = useResetPassword()

  if (!token) {
    return <Alert severity="error">Ce lien de réinitialisation est invalide ou incomplet.</Alert>
  }

  const onSubmit = handleSubmit((values) => {
    resetPasswordMutation.mutate({ token, newPassword: values.newPassword })
  })

  return (
    <Stack component="form" onSubmit={onSubmit} spacing={2} noValidate>
      {resetPasswordMutation.isError && (
        <Alert severity="error">{getErrorMessage(resetPasswordMutation.error)}</Alert>
      )}
      <FormTextField
        name="newPassword"
        control={control}
        label="Nouveau mot de passe"
        type="password"
        autoComplete="new-password"
        autoFocus
      />
      <FormTextField
        name="confirmPassword"
        control={control}
        label="Confirmer le mot de passe"
        type="password"
        autoComplete="new-password"
      />
      <AppButton
        type="submit"
        variant="contained"
        size="large"
        loading={resetPasswordMutation.isPending}
      >
        Réinitialiser le mot de passe
      </AppButton>
    </Stack>
  )
}
