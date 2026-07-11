import type { SvgIconComponent } from '@mui/icons-material'
import HomeIcon from '@mui/icons-material/Home'
import PeopleIcon from '@mui/icons-material/People'
import PersonIcon from '@mui/icons-material/Person'

export interface NavigationItem {
  label: string
  path: string
  icon: SvgIconComponent
  requiredRole?: string
}

// New features register their entry point here — no change to MainLayout needed.
export const navigationItems: NavigationItem[] = [
  { label: 'Accueil', path: '/', icon: HomeIcon },
  { label: 'Profil', path: '/profile', icon: PersonIcon },
  { label: 'Utilisateurs', path: '/admin/users', icon: PeopleIcon, requiredRole: 'ROLE_ADMIN' },
]
