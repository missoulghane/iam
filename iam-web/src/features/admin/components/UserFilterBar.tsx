import { useRef, useState } from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import type { UserListFilters } from '../types/admin.types'

interface UserFilterBarProps {
  filters: UserListFilters
  onChange: (filters: UserListFilters) => void
}

const ROLE_OPTIONS = ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_MASTER']
const SEARCH_DEBOUNCE_MS = 300

export function UserFilterBar({ filters, onChange }: UserFilterBarProps) {
  const [search, setSearch] = useState(filters.search ?? '')
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Debounced so free-text typing doesn't trigger a network call per keystroke.
  // The timeout closure captures this render's `filters`/`onChange`, and the
  // previous pending timer is always cleared first, so only the latest
  // keystroke's values are ever applied.
  const handleSearchChange = (value: string) => {
    setSearch(value)
    clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => {
      onChange({ ...filters, search: value || undefined })
    }, SEARCH_DEBOUNCE_MS)
  }

  const handleRoleChange = (event: SelectChangeEvent) => {
    onChange({ ...filters, role: event.target.value || undefined })
  }

  const handleEnabledChange = (event: SelectChangeEvent) => {
    const value = event.target.value
    onChange({ ...filters, enabled: value === '' ? undefined : value === 'true' })
  }

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
      <TextField
        label="Rechercher (email, prénom, nom)"
        value={search}
        onChange={(event) => handleSearchChange(event.target.value)}
        size="small"
        sx={{ minWidth: 260 }}
      />
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Rôle</InputLabel>
        <Select label="Rôle" value={filters.role ?? ''} onChange={handleRoleChange}>
          <MenuItem value="">Tous les rôles</MenuItem>
          {ROLE_OPTIONS.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Statut</InputLabel>
        <Select
          label="Statut"
          value={filters.enabled === undefined ? '' : String(filters.enabled)}
          onChange={handleEnabledChange}
        >
          <MenuItem value="">Tous les statuts</MenuItem>
          <MenuItem value="true">Activé</MenuItem>
          <MenuItem value="false">Désactivé</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  )
}
