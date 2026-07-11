import { CenteredCardLayout } from '@/shared/components/CenteredCardLayout'
import { ActivateAccountForm } from '../components/ActivateAccountForm'

export default function ActivateAccountPage() {
  return (
    <CenteredCardLayout title="Activation du compte">
      <ActivateAccountForm />
    </CenteredCardLayout>
  )
}
