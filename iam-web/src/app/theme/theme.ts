import type { ThemeOptions } from '@mui/material/styles'
import { typography } from './typography'
import { components } from './components'

export type ThemeMode = 'light' | 'dark'

export const baseThemeOptions: ThemeOptions = {
  shape: { borderRadius: 8 },
  typography,
  components,
}
