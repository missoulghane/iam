import { createTheme } from '@mui/material/styles'
import { baseThemeOptions } from './theme'
import { darkPalette } from './palette'

export const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: darkPalette,
})
