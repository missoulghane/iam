import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import { AppButton } from '@/shared/components/AppButton'
import { FormTextField } from '@/shared/components/FormTextField'
import { PageHeader } from '@/shared/components/PageHeader'
import { getErrorMessage } from '@/shared/api/error-handler'
import { useNotification } from '@/shared/hooks/useNotification'
import { useCreateUser } from '../hooks/useCreateUser'
import { createUserSchema, type CreateUserFormValues } from '../schemas/create-user.schema'

export default function CreateUserPage() {
  const navigate = useNavigate()
  const { control, handleSubmit } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { email: '', firstName: '', lastName: '' },
  })
  const createUserMutation = useCreateUser()
  const { notify } = useNotification()

  const onSubmit = handleSubmit((values) => {
    createUserMutation.mutate(values, {
      onSuccess: () => {
        notify("Utilisateur créé avec succès. Un email d'activation lui a été envoyé.")
        navigate('/admin/users')
      },
    })
  })

  return (
    <>
      <PageHeader title="Nouvel utilisateur" subtitle="Créez un nouveau compte utilisateur" />
      <Stack component="form" onSubmit={onSubmit} spacing={2} noValidate sx={{ maxWidth: 480 }}>
        {createUserMutation.isError && (
          <Alert severity="error">{getErrorMessage(createUserMutation.error)}</Alert>
        )}
        <FormTextField
          name="email"
          control={control}
          label="Email"
          type="email"
          autoComplete="email"
          autoFocus
        />
        <FormTextField
          name="firstName"
          control={control}
          label="Prénom"
          autoComplete="given-name"
        />
        <FormTextField name="lastName" control={control} label="Nom" autoComplete="family-name" />
        <Stack direction="row" spacing={2}>
          <AppButton type="submit" variant="contained" loading={createUserMutation.isPending}>
            Créer
          </AppButton>
          <AppButton
            variant="outlined"
            disabled={createUserMutation.isPending}
            onClick={() => navigate('/admin/users')}
          >
            Annuler
          </AppButton>
        </Stack>
      </Stack>
    </>
  )
}
