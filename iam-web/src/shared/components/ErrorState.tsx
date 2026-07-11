import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { AppButton } from './AppButton'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Une erreur est survenue',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        py: 6,
        textAlign: 'center',
      }}
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: 40 }} />
      <Typography variant="subtitle1">{title}</Typography>
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
      {onRetry && (
        <AppButton variant="outlined" onClick={onRetry} sx={{ mt: 1 }}>
          Réessayer
        </AppButton>
      )}
    </Box>
  )
}
