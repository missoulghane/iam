import { CenteredCardLayout } from '@/shared/components/CenteredCardLayout'
import { ForgotPasswordForm } from '../components/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <CenteredCardLayout
      title="Mot de passe oublié"
      subtitle="Nous vous enverrons un lien de réinitialisation"
    >
      <ForgotPasswordForm />
    </CenteredCardLayout>
  )
}
