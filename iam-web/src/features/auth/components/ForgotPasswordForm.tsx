import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { AppButton } from '@/shared/components/AppButton'
import { FormTextField } from '@/shared/components/FormTextField'
import { getErrorMessage } from '@/shared/api/error-handler'
import { useForgotPassword } from '../hooks/useForgotPassword'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '../schemas/forgot-password.schema'

export function ForgotPasswordForm() {
  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })
  const forgotPasswordMutation = useForgotPassword()

  if (forgotPasswordMutation.isSuccess) {
    return (
      <Alert severity="success">
        Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé.
      </Alert>
    )
  }

  const onSubmit = handleSubmit((values) => {
    forgotPasswordMutation.mutate(values)
  })

  return (
    <Stack component="form" onSubmit={onSubmit} spacing={2} noValidate>
      <Typography variant="body2" color="text.secondary">
        Saisissez votre email pour recevoir un lien de réinitialisation de mot de passe.
      </Typography>
      {forgotPasswordMutation.isError && (
        <Alert severity="error">{getErrorMessage(forgotPasswordMutation.error)}</Alert>
      )}
      <FormTextField
        name="email"
        control={control}
        label="Email"
        type="email"
        autoComplete="email"
        autoFocus
      />
      <AppButton
        type="submit"
        variant="contained"
        size="large"
        loading={forgotPasswordMutation.isPending}
      >
        Envoyer le lien
      </AppButton>
    </Stack>
  )
}
