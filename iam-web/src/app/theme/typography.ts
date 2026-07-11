import type { ThemeOptions } from '@mui/material/styles'

export const typography: ThemeOptions['typography'] = {
  fontFamily: ['"Inter"', '"Roboto"', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
  h1: { fontWeight: 700, fontSize: '2.5rem' },
  h2: { fontWeight: 700, fontSize: '2rem' },
  h3: { fontWeight: 600, fontSize: '1.75rem' },
  h4: { fontWeight: 600, fontSize: '1.5rem' },
  h5: { fontWeight: 600, fontSize: '1.25rem' },
  h6: { fontWeight: 600, fontSize: '1.125rem' },
  subtitle1: { fontWeight: 500 },
  button: { textTransform: 'none', fontWeight: 600 },
}
