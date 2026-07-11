import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'
import VisibilityIcon from '@mui/icons-material/Visibility'
import type { UserResponse } from '@/shared/types/user'

interface UsersDataGridProps {
  rows: UserResponse[]
  rowCount: number
  loading: boolean
  paginationModel: GridPaginationModel
  onPaginationModelChange: (model: GridPaginationModel) => void
  onView: (user: UserResponse) => void
  onEdit: (user: UserResponse) => void
  onToggleStatus: (user: UserResponse) => void
  onDelete: (user: UserResponse) => void
  onResendActivation: (user: UserResponse) => void
}

export function UsersDataGrid({
  rows,
  rowCount,
  loading,
  paginationModel,
  onPaginationModelChange,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
  onResendActivation,
}: UsersDataGridProps) {
  const columns: GridColDef<UserResponse>[] = [
    { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 200 },
    { field: 'firstName', headerName: 'Prénom', flex: 1, minWidth: 120 },
    { field: 'lastName', headerName: 'Nom', flex: 1, minWidth: 120 },
    {
      field: 'roles',
      headerName: 'Rôles',
      flex: 1.2,
      minWidth: 160,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ py: 1 }}>
          {params.value.map((role: string) => (
            <Chip key={role} size="small" label={role} variant="outlined" />
          ))}
        </Stack>
      ),
    },
    {
      field: 'verified',
      headerName: 'Vérifié',
      width: 110,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value ? 'Oui' : 'Non'}
          color={params.value ? 'success' : 'warning'}
          variant="outlined"
        />
      ),
    },
    {
      field: 'enabled',
      headerName: 'Statut',
      width: 120,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value ? 'Activé' : 'Désactivé'}
          color={params.value ? 'success' : 'default'}
          variant="outlined"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Consulter">
            <IconButton size="small" onClick={() => onView(params.row)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier">
            <IconButton size="small" onClick={() => onEdit(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.enabled ? 'Désactiver' : 'Activer'}>
            <IconButton size="small" onClick={() => onToggleStatus(params.row)}>
              {params.row.enabled ? (
                <BlockIcon fontSize="small" />
              ) : (
                <CheckCircleIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
          {!params.row.verified && (
            <Tooltip title="Renvoyer l'invitation">
              <IconButton size="small" onClick={() => onResendActivation(params.row)}>
                <MarkEmailReadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Supprimer">
            <IconButton size="small" onClick={() => onDelete(params.row)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        rowCount={rowCount}
        loading={loading}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[10, 20, 50]}
        disableRowSelectionOnClick
        autoHeight
      />
    </Box>
  )
}
