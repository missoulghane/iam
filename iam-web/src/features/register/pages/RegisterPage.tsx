import { CenteredCardLayout } from '@/shared/components/CenteredCardLayout'
import { RegisterForm } from '../components/RegisterForm'

export default function RegisterPage() {
  return (
    <CenteredCardLayout title="Créer un compte" subtitle="Rejoignez IAM en quelques instants">
      <RegisterForm />
    </CenteredCardLayout>
  )
}
