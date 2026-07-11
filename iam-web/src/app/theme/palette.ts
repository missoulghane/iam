import type { ThemeOptions } from '@mui/material/styles'

export const lightPalette: ThemeOptions['palette'] = {
  mode: 'light',
  primary: {
    main: '#1565C0',
    light: '#5E92F3',
    dark: '#003C8F',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#00897B',
    light: '#4EBAAA',
    dark: '#005B4F',
    contrastText: '#FFFFFF',
  },
  error: { main: '#D32F2F' },
  warning: { main: '#ED6C02' },
  info: { main: '#0288D1' },
  success: { main: '#2E7D32' },
  background: { default: '#F4F6F8', paper: '#FFFFFF' },
}

export const darkPalette: ThemeOptions['palette'] = {
  mode: 'dark',
  primary: {
    main: '#5E92F3',
    light: '#8AB4F8',
    dark: '#1565C0',
    contrastText: '#0B0E14',
  },
  secondary: {
    main: '#4EBAAA',
    light: '#7FD4C6',
    dark: '#00897B',
    contrastText: '#0B0E14',
  },
  error: { main: '#EF5350' },
  warning: { main: '#FFA726' },
  info: { main: '#29B6F6' },
  success: { main: '#66BB6A' },
  background: { default: '#0F1319', paper: '#171C24' },
}
