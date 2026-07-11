import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'react-router'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { AppButton } from '@/shared/components/AppButton'
import { FormTextField } from '@/shared/components/FormTextField'
import { getErrorMessage } from '@/shared/api/error-handler'
import { useActivateAccount } from '../hooks/useActivateAccount'
import {
  activateAccountSchema,
  type ActivateAccountFormValues,
} from '../schemas/activate-account.schema'

export function ActivateAccountForm() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const { control, handleSubmit } = useForm<ActivateAccountFormValues>({
    resolver: zodResolver(activateAccountSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })
  const activateAccountMutation = useActivateAccount()

  if (!token) {
    return <Alert severity="error">Ce lien d'activation est invalide ou incomplet.</Alert>
  }

  const onSubmit = handleSubmit((values) => {
    activateAccountMutation.mutate({ token, newPassword: values.newPassword })
  })

  return (
    <Stack component="form" onSubmit={onSubmit} spacing={2} noValidate>
      <Typography variant="body2" color="text.secondary">
        Choisissez votre mot de passe pour activer votre compte.
      </Typography>
      {activateAccountMutation.isError && (
        <Alert severity="error">{getErrorMessage(activateAccountMutation.error)}</Alert>
      )}
      <FormTextField
        name="newPassword"
        control={control}
        label="Mot de passe"
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
        loading={activateAccountMutation.isPending}
      >
        Activer mon compte
      </AppButton>
    </Stack>
  )
}
