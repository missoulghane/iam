import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { PageHeader } from '@/shared/components/PageHeader'
import { LoadingState } from '@/shared/components/LoadingState'
import { ErrorState } from '@/shared/components/ErrorState'
import { getErrorMessage } from '@/shared/api/error-handler'
import { useProfile } from '../hooks/useProfile'
import { ProfileInfoCard } from '../components/ProfileInfoCard'
import { ProfileEditForm } from '../components/ProfileEditForm'
import { ChangePasswordForm } from '../components/ChangePasswordForm'

export default function ProfilePage() {
  const profileQuery = useProfile()

  return (
    <>
      <PageHeader
        title="Mon profil"
        subtitle="Consultez et modifiez vos informations personnelles"
      />
      {profileQuery.isLoading && <LoadingState label="Chargement du profil..." />}
      {profileQuery.isError && (
        <ErrorState
          message={getErrorMessage(profileQuery.error)}
          onRetry={() => profileQuery.refetch()}
        />
      )}
      {profileQuery.data && (
        <Stack spacing={3} sx={{ maxWidth: 640 }}>
          <ProfileInfoCard user={profileQuery.data} />
          <Divider />
          <Typography variant="h6">Informations personnelles</Typography>
          <ProfileEditForm user={profileQuery.data} />
          <Divider />
          <Typography variant="h6">Mot de passe</Typography>
          <ChangePasswordForm />
        </Stack>
      )}
    </>
  )
}
