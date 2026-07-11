import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { UserAvatar } from '@/shared/components/UserAvatar'
import type { UserResponse } from '@/shared/types/user'

interface UserDetailCardProps {
  user: UserResponse
}

export function UserDetailCard({ user }: UserDetailCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <UserAvatar
            firstName={user.firstName}
            lastName={user.lastName}
            sx={{ width: 64, height: 64, fontSize: '1.5rem' }}
          />
          <Box>
            <Typography variant="h6">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
          <Chip
            size="small"
            label={user.verified ? 'Compte vérifié' : 'Compte non vérifié'}
            color={user.verified ? 'success' : 'warning'}
            variant="outlined"
          />
          <Chip
            size="small"
            label={user.enabled ? 'Compte activé' : 'Compte désactivé'}
            color={user.enabled ? 'success' : 'default'}
            variant="outlined"
          />
          {user.roles.map((role) => (
            <Chip key={role} size="small" label={role} variant="outlined" />
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}
