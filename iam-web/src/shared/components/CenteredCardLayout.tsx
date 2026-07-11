import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

interface CenteredCardLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
}

// Shared by every standalone, unauthenticated page (auth, register, ...) that
// presents a single form in a centered card.
export function CenteredCardLayout({ title, subtitle, children }: CenteredCardLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper variant="outlined" sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {subtitle}
            </Typography>
          )}
          {children}
        </Paper>
      </Container>
    </Box>
  )
}
