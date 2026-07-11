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
import { useLogin } from '../hooks/useLogin'
import { loginSchema, type LoginFormValues } from '../schemas/login.schema'

export function LoginForm() {
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })
  const loginMutation = useLogin()

  const onSubmit = handleSubmit((values) => {
    loginMutation.mutate(values)
  })

  return (
    <Stack component="form" onSubmit={onSubmit} spacing={2} noValidate>
      {loginMutation.isError && (
        <Alert severity="error">{getErrorMessage(loginMutation.error)}</Alert>
      )}
      <FormTextField
        name="email"
        control={control}
        label="Email"
        type="email"
        autoComplete="email"
        autoFocus
      />
      <FormTextField
        name="password"
        control={control}
        label="Mot de passe"
        type="password"
        autoComplete="current-password"
      />
      <Link
        component={RouterLink}
        to="/forgot-password"
        variant="body2"
        sx={{ alignSelf: 'flex-end' }}
      >
        Mot de passe oublié ?
      </Link>
      <AppButton type="submit" variant="contained" size="large" loading={loginMutation.isPending}>
        Se connecter
      </AppButton>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        Pas encore de compte ?{' '}
        <Link component={RouterLink} to="/register">
          S'inscrire
        </Link>
      </Typography>
    </Stack>
  )
}
