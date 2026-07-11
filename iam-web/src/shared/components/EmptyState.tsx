import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'

interface EmptyStateProps {
  title?: string
  message?: string
  action?: ReactNode
}

export function EmptyState({ title = 'Aucune donnée', message, action }: EmptyStateProps) {
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
      <InboxOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
      <Typography variant="subtitle1">{title}</Typography>
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
      {action}
    </Box>
  )
}
