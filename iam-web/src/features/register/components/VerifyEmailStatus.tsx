import { Link as RouterLink, useSearchParams } from 'react-router'
import Alert from '@mui/material/Alert'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { AppButton } from '@/shared/components/AppButton'
import { getErrorMessage } from '@/shared/api/error-handler'
import { useVerifyEmail } from '../hooks/useVerifyEmail'

// Confirmation requires an explicit click rather than firing on mount: mail
// clients and security gateways (Gmail included) routinely prefetch links found
// in emails to scan them, which would silently consume the single-use token
// before the user ever opens the page.
export function VerifyEmailStatus() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const verifyEmailMutation = useVerifyEmail()

  if (!token) {
    return <Alert severity="error">Ce lien de confirmation est invalide ou incomplet.</Alert>
  }

  if (verifyEmailMutation.isSuccess) {
    return (
      <Stack spacing={2}>
        <Alert severity="success">
          Votre adresse email a été confirmée. Vous pouvez vous connecter.
        </Alert>
        <Link component={RouterLink} to="/login" variant="body2" sx={{ alignSelf: 'center' }}>
          Se connecter
        </Link>
      </Stack>
    )
  }

  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary">
        Cliquez ci-dessous pour confirmer votre adresse email.
      </Typography>
      {verifyEmailMutation.isError && (
        <Alert severity="error">{getErrorMessage(verifyEmailMutation.error)}</Alert>
      )}
      <AppButton
        variant="contained"
        size="large"
        loading={verifyEmailMutation.isPending}
        onClick={() => verifyEmailMutation.mutate({ token })}
      >
        Confirmer mon compte
      </AppButton>
    </Stack>
  )
}
