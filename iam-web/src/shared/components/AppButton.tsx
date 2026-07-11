import Button, { type ButtonProps } from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

interface AppButtonProps extends ButtonProps {
  loading?: boolean
}

export function AppButton({
  loading = false,
  disabled,
  startIcon,
  children,
  ...props
}: AppButtonProps) {
  return (
    <Button
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : startIcon}
      {...props}
    >
      {children}
    </Button>
  )
}
