import { CenteredCardLayout } from '@/shared/components/CenteredCardLayout'
import { ResetPasswordForm } from '../components/ResetPasswordForm'

export default function ResetPasswordPage() {
  return (
    <CenteredCardLayout title="Réinitialiser le mot de passe">
      <ResetPasswordForm />
    </CenteredCardLayout>
  )
}
