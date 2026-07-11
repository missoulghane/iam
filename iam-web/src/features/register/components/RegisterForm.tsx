import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link as RouterLink } from 'react-router'
import Alert from '@mui/material/Alert'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { AppButton } from '@/shared/components/AppButton'
import { FormTextField } from '@/shared/components/FormTextField'
import { getErrorMessage } from '@/shared/api/error-handler'
import { useRegister } from '../hooks/useRegister'
import { useResendVerification } from '../hooks/useResendVerification'
import { registerSchema, type RegisterFormValues } from '../schemas/register.schema'

export function RegisterForm() {
  const { control, handleSubmit, getValues } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
  })
  const registerMutation = useRegister()
  const resendMutation = useResendVerification()

  if (registerMutation.isSuccess) {
    const email = getValues('email')
    return (
      <Stack spacing={2}>
        <Alert severity="success">
          Votre compte a été créé. Vérifiez votre boîte mail ({email}) pour l'activer.
        </Alert>
        {resendMutation.isSuccess ? (
          <Alert severity="info">Un nouvel email de vérification a été envoyé.</Alert>
        ) : (
          <AppButton
            variant="outlined"
            loading={resendMutation.isPending}
            onClick={() => resendMutation.mutate({ email })}
          >
            Renvoyer l'email de vérification
          </AppButton>
        )}
        <Link component={RouterLink} to="/login" variant="body2" sx={{ alignSelf: 'center' }}>
          Retour à la connexion
        </Link>
      </Stack>
    )
  }

  const onSubmit = handleSubmit(({ confirmPassword, ...payload }) => {
    registerMutation.mutate(payload)
  })

  return (
    <Stack component="form" onSubmit={onSubmit} spacing={2} noValidate>
      {registerMutation.isError && (
        <Alert severity="error">{getErrorMessage(registerMutation.error)}</Alert>
      )}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FormTextField
          name="firstName"
          control={control}
          label="Prénom"
          autoComplete="given-name"
          autoFocus
        />
        <FormTextField name="lastName" control={control} label="Nom" autoComplete="family-name" />
      </Stack>
      <FormTextField
        name="email"
        control={control}
        label="Email"
        type="email"
        autoComplete="email"
      />
      <FormTextField
        name="password"
        control={control}
        label="Mot de passe"
        type="password"
        autoComplete="new-password"
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
        loading={registerMutation.isPending}
      >
        Créer mon compte
      </AppButton>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        Déjà un compte ?{' '}
        <Link component={RouterLink} to="/login">
          Se connecter
        </Link>
      </Typography>
    </Stack>
  )
}
