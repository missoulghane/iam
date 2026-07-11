import { useState } from 'react'
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import MenuIcon from '@mui/icons-material/Menu'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { useThemeMode } from '@/app/providers/ThemeModeProvider'
import { navigationItems } from '@/app/config/navigation'
import { UserMenu, type UserMenuUser } from '@/shared/components/UserMenu'

const DRAWER_WIDTH = 260
const DRAWER_WIDTH_COLLAPSED = 72

interface MainLayoutProps {
  user: UserMenuUser | null
  onLogout: () => void
}

export function MainLayout({ user, onLogout }: MainLayoutProps) {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const { mode, toggleMode } = useThemeMode()
  const location = useLocation()
  const navigate = useNavigate()

  const drawerWidth = collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH
  const showLabels = !collapsed || !isDesktop

  const visibleNavigationItems = navigationItems.filter(
    (item) => !item.requiredRole || user?.roles.includes(item.requiredRole),
  )

  const drawerContent = (
    <List sx={{ px: 1, py: 1 }}>
      {visibleNavigationItems.map((item) => {
        const Icon = item.icon
        const selected = location.pathname === item.path
        return (
          <ListItemButton
            key={item.path}
            component={RouterLink}
            to={item.path}
            selected={selected}
            onClick={() => setMobileOpen(false)}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Icon />
            </ListItemIcon>
            {showLabels && <ListItemText primary={item.label} />}
          </ListItemButton>
        )
      })}
    </List>
  )

  const breadcrumbSegments = location.pathname.split('/').filter(Boolean)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          transition: theme.transitions.create(['width', 'margin']),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => (isDesktop ? setCollapsed((v) => !v) : setMobileOpen(true))}
            sx={{ mr: 2 }}
            aria-label="Basculer la navigation"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            IAM
          </Typography>
          <IconButton
            color="inherit"
            onClick={toggleMode}
            aria-label="Changer de thème"
            sx={{ mr: 1 }}
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          {user && (
            <UserMenu user={user} onProfileClick={() => navigate('/profile')} onLogout={onLogout} />
          )}
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              transition: theme.transitions.create('width'),
              overflowX: 'hidden',
            },
          }}
        >
          <Toolbar />
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Box sx={{ px: 3, pt: 2 }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="Fil d'Ariane">
            {breadcrumbSegments.length === 0 ? (
              <Typography color="text.primary">Accueil</Typography>
            ) : (
              <Link component={RouterLink} to="/" underline="hover" color="inherit">
                Accueil
              </Link>
            )}
            {breadcrumbSegments.map((segment, index) => {
              const path = '/' + breadcrumbSegments.slice(0, index + 1).join('/')
              const isLast = index === breadcrumbSegments.length - 1
              const label = navigationItems.find((item) => item.path === path)?.label ?? segment
              return isLast ? (
                <Typography key={path} color="text.primary" sx={{ textTransform: 'capitalize' }}>
                  {label}
                </Typography>
              ) : (
                <Link
                  key={path}
                  component={RouterLink}
                  to={path}
                  underline="hover"
                  color="inherit"
                  sx={{ textTransform: 'capitalize' }}
                >
                  {label}
                </Link>
              )
            })}
          </Breadcrumbs>
        </Box>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
        <Box component="footer" sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} IAM
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
