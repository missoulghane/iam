import { CenteredCardLayout } from '@/shared/components/CenteredCardLayout'
import { VerifyEmailStatus } from '../components/VerifyEmailStatus'

export default function VerifyEmailPage() {
  return (
    <CenteredCardLayout title="Confirmation de l'email">
      <VerifyEmailStatus />
    </CenteredCardLayout>
  )
}
