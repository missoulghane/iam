import Avatar, { type AvatarProps } from '@mui/material/Avatar'

interface UserAvatarProps extends AvatarProps {
  firstName?: string | null
  lastName?: string | null
}

function getInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.trim().charAt(0) ?? ''
  const last = lastName?.trim().charAt(0) ?? ''
  return (first + last).toUpperCase() || '?'
}

export function UserAvatar({ firstName, lastName, sx, ...props }: UserAvatarProps) {
  return (
    <Avatar
      sx={[
        { bgcolor: 'primary.main', color: 'primary.contrastText', fontSize: '0.875rem' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      {getInitials(firstName, lastName)}
    </Avatar>
  )
}
