import Paper from '@mui/material/Paper'
import { useAuth } from '@/features/auth'
import { PageHeader } from '@/shared/components/PageHeader'
import { EmptyState } from '@/shared/components/EmptyState'
import { getTimeBasedGreeting } from '@/shared/utils/greeting'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <>
      <PageHeader
        title={`${getTimeBasedGreeting()}, ${user?.firstName ?? ''}`}
        subtitle="Bienvenue sur votre espace IAM"
      />
      <Paper variant="outlined" sx={{ p: 4 }}>
        <EmptyState
          title="Aucun widget pour le moment"
          message="Les futurs modules apparaîtront ici au fur et à mesure de leur ajout."
        />
      </Paper>
    </>
  )
}
