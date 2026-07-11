import { createTheme } from '@mui/material/styles'
import { baseThemeOptions } from './theme'
import { lightPalette } from './palette'

export const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: lightPalette,
})
